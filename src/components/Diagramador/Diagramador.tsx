// src/components/Diagramador/Diagramador.tsx

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import SidebarPaleta from "./SidebarPaleta";
import CanvasEditor from "./CanvasEditor";
import Toolbar from "./Toolbar";
import TabsBar from "./TabsBar";

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
  const [selectedDevice, setSelectedDevice] = useState<DeviceKey>("phoneStandard");

  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab1", name: "Pantalla 1", elementos: [] },
  ]);
  const [selectedTabId, setSelectedTabId] = useState("tab1");
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const tabsRef = useRef(tabs);
  const deviceRef = useRef(selectedDevice);
  useEffect(() => { tabsRef.current = tabs; }, [tabs]);
  useEffect(() => { deviceRef.current = selectedDevice; }, [selectedDevice]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 1️⃣ Cargar proyecto
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
          if (parsed.dispositivo) setSelectedDevice(parsed.dispositivo as DeviceKey);
        }
      } catch (e) {
        console.error("Error al cargar proyecto", e);
        alert("No se pudo cargar el proyecto");
        navigate("/dashboard");
      }
    };
    fetchData();
  }, [projectId, navigate]);

  // 2️⃣ Guardar cada 10s
  useEffect(() => {
    if (!projectId) return;
    const interval = setInterval(() => {
      guardarProyecto();
    }, 10_000);
    return () => clearInterval(interval);
  }, [projectId]);

  const guardarProyecto = async () => {
    try {
      setIsSaving(true);
      await axiosInstance.put(`/proyectos/${projectId}`, {
        contenido: JSON.stringify({
          pestañas: tabsRef.current,
          dispositivo: deviceRef.current,
        }),
      });
    } catch (e) {
      console.error("Error al guardar", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Acciones
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
    const nueva: Tab = { id: newId, name: newName, elementos: [] };
    setTabs((prev) => [...prev, nueva]);
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
  const device = DEVICES[selectedDevice];

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", alignItems: "center", padding: 8, background: "#1f2937", color: "#fff" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginRight: 12,
            padding: "6px 10px",
            background: "#2563eb",
            border: "none",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer"
          }}
        >
          ← Volver
        </button>
        <h2 style={{ margin: 0 }}>{nombreProyecto || "Proyecto"}</h2>
        <span style={{ marginLeft: "auto", marginRight: 12, color: isSaving ? "#fbbf24" : "#10b981" }}>
          {isSaving ? "Guardando…" : "Guardado"}
        </span>
      </div>

      {/* Cuerpo */}
      <div style={{ width: "100%", height: "calc(100vh - 46px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TabsBar
          tabs={tabs}
          selectedTabId={selectedTabId}
          onSelect={setSelectedTabId}
          onAddTab={handleAddTab}
          onRenameTab={handleRenameTab}
          onDeleteTab={handleDeleteTab}
        />

        <Toolbar
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetZoom={resetZoom}
          selectedDevice={selectedDevice}
          onDeviceChange={setSelectedDevice}
        />

        <div style={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
          {/* Sidebar con ancho fijo */}
          <div style={{
            width: 200,
            minWidth: 200,
            maxWidth: 200,
            flexShrink: 0,
            backgroundColor: "#f7f7f7",
            borderRight: "1px solid #ccc",
            padding: 10,
            boxSizing: "border-box"
          }}>
            <SidebarPaleta />
          </div>

          {/* Canvas scrollable */}
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
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
