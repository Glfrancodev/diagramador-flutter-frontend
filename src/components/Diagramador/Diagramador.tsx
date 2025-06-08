import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import SidebarPaleta from "./SidebarPaleta";
import CanvasEditor from "./CanvasEditor";
import Toolbar from "./Toolbar";
import TabsBar from "./TabsBar";
import PropiedadesPanel from "./PropiedadesPanel";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DEVICES } from "../../constants/devices";
import type { DeviceKey } from "../../constants/devices";
import axiosInstance from "../../services/axiosInstance";

export type Elemento = {
  id: string;
  tipo: string;
  x: number;
  y: number;
  width: number;
  height: number;
  props?: any;
};

type Tab = {
  id: string;
  name: string;
  elementos: Elemento[];
};

export default function Diagramador() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [zoom, setZoom] = useState(0.85);
  const [_selectedDevice, _setSelectedDevice] = useState<DeviceKey>("phoneStandard");

  const setSelectedDevice = (d: DeviceKey) => {
    _setSelectedDevice(d);
    deviceRef.current = d;
  };

  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab1", name: "Pantalla 1", elementos: [] },
  ]);
  const [selectedTabId, setSelectedTabId] = useState("tab1");
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const tabsRef = useRef(tabs);
  const deviceRef = useRef<DeviceKey>("phoneStandard");
  useEffect(() => { tabsRef.current = tabs; }, [tabs]);
  useEffect(() => { deviceRef.current = _selectedDevice; }, [_selectedDevice]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(`/proyectos/${projectId}`);
        setNombreProyecto(data.nombre);
        if (data.contenido) {
          const parsed = JSON.parse(data.contenido);
          if (parsed.pestañas?.length) {
            setTabs(parsed.pestañas);
            setSelectedTabId(parsed.pestañas[0].id);
          }
        }
      } catch (e) {
        console.error("Error al cargar proyecto", e);
        alert("No se pudo cargar el proyecto");
        navigate("/dashboard");
      }
    };
    fetchData();
  }, [projectId, navigate]);

  useEffect(() => {
    if (!projectId) return;
    const interval = setInterval(() => guardarProyecto(), 10_000);
    return () => clearInterval(interval);
  }, [projectId]);

  const guardarProyecto = async () => {
    try {
      setIsSaving(true);
      await axiosInstance.put(`/proyectos/${projectId}`, {
        contenido: JSON.stringify({
          pestañas: tabsRef.current
        }),
      });
    } catch (e) {
      console.error("Error al guardar", e);
    } finally {
      setIsSaving(false);
    }
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const resetZoom = () => setZoom(0.85);

  const handleAddTab = () => {
    let index = tabs.length + 1;
    let newName = `Pantalla ${index}`;
    while (tabs.some((t) => t.name === newName)) {
      index++;
      newName = `Pantalla ${index}`;
    }
    const newId = `tab${Date.now()}`;
    setTabs((prev) => [...prev, { id: newId, name: newName, elementos: [] }]);
    setSelectedTabId(newId);
  };

  const handleRenameTab = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (trimmed === "") return;
    if (tabs.some((t) => t.name === trimmed && t.id !== id)) {
      alert("Ya existe otra pestaña con ese nombre");
      return;
    }
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: trimmed } : t))
    );
  };

  const handleDeleteTab = (id: string) => {
    if (tabs.length === 1) {
      alert("No puedes eliminar la única pestaña");
      return;
    }
    setTabs((prev) => prev.filter((t) => t.id !== id));
    if (selectedTabId === id) {
      setSelectedTabId(tabs.find((t) => t.id !== id)!.id);
    }
  };

  const updateElementos = (
    tabId: string,
    updater: (prev: Elemento[]) => Elemento[]
  ) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, elementos: updater(tab.elementos) } : tab
      )
    );
  };

  const selectedTab = tabs.find((t) => t.id === selectedTabId);
  const selectedElement = selectedTab?.elementos.find((el) => el.id === selectedElementId) ?? null;
  const device = DEVICES[_selectedDevice];

  const updateElemento = (fn: (el: Elemento) => Elemento) => {
    if (!selectedElementId || !selectedTab) return;
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === selectedTab.id
          ? {
              ...tab,
              elementos: tab.elementos.map((el) =>
                el.id === selectedElementId ? fn(el) : el
              ),
            }
          : tab
      )
    );
  };

  const deleteElemento = () => {
    if (!selectedElementId || !selectedTab) return;
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === selectedTab.id
          ? {
              ...tab,
              elementos: tab.elementos.filter((el) => el.id !== selectedElementId),
            }
          : tab
      )
    );
    setSelectedElementId(null);
  };

  useEffect(() => {
    const isTextEditing = (el: Element | null) => {
      if (!el) return false;
      const tag = (el as HTMLElement).tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (el as HTMLElement).isContentEditable
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        !isTextEditing(document.activeElement)
      ) {
        deleteElemento();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [selectedElementId, selectedTab]);

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Barra superior */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: 8,
          background: "#1f2937",
          color: "#fff",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginRight: 12,
            padding: "6px 10px",
            background: "#2563eb",
            border: "none",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ← Volver
        </button>
        <h2 style={{ margin: 0 }}>{nombreProyecto || "Proyecto"}</h2>
        <span
          style={{
            marginLeft: "auto",
            marginRight: 12,
            color: isSaving ? "#fbbf24" : "#10b981",
          }}
        >
          {isSaving ? "Guardando…" : "Guardado"}
        </span>
      </div>

      {/* Cuerpo */}
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 46px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Tabs */}
        <TabsBar
          tabs={tabs}
          selectedTabId={selectedTabId}
          onSelect={setSelectedTabId}
          onAddTab={handleAddTab}
          onRenameTab={handleRenameTab}
          onDeleteTab={handleDeleteTab}
        />

        {/* Toolbar */}
        <Toolbar
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetZoom={resetZoom}
          selectedDevice={_selectedDevice}
          onDeviceChange={setSelectedDevice}
        />

        {/* Zona principal */}
        <div style={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
          {/* Paleta */}
          <div
            style={{
              width: 200,
              minWidth: 200,
              maxWidth: 200,
              flexShrink: 0,
              backgroundColor: "#f7f7f7",
              borderRight: "1px solid #ccc",
              padding: 10,
              boxSizing: "border-box",
            }}
          >
            <SidebarPaleta />
          </div>

          {/* Canvas */}
          <div
            ref={scrollRef}
            style={{
              flexGrow: 1,
              overflow: "auto",
              backgroundColor: "#f0f0f0",
              padding: 20,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "block" }}>
              {selectedTab && (
                <CanvasEditor
                  tabId={selectedTab.id}
                  zoom={zoom}
                  width={device.width}
                  height={device.height}
                  elementos={selectedTab.elementos}
                  onChange={updateElementos}
                  onSelect={setSelectedElementId}
                  selectedElementId={selectedElementId}
                />
              )}
            </div>
          </div>

          {/* Panel de propiedades con scroll */}
          <div
            style={{
              width: 280,
              minWidth: 280,
              maxWidth: 280,
              backgroundColor: "#fafafa",
              borderLeft: "1px solid #ccc",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              <PropiedadesPanel
                elemento={selectedElement}
                onUpdate={updateElemento}
                canvasHeight={device.height} // ✅ agregar
                proyectoId={projectId!} // ✅ esto es lo correcto
              />
            </div>
          </div>

        </div>
      </div>
    </DndProvider>
  );
}
