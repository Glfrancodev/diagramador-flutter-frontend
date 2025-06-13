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


import { io } from "socket.io-client";



import useOnlineStatus from "../../hooks/useOnlineStatus";
import { guardarCambioOffline, guardarProyectoOffline } from "../../db/utils";
import { db } from '../../db/indexedDb';

export type Elemento = {
  id: string;
  tipo: string;
  x: number;
  y: number;
  zIndex: number;  // Asegúrate de que zIndex esté aquí
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
  useEffect(() => {
    // Añadir clase cuando se monta
    document.body.classList.add("diagramador-mode");

    // Limpiar cuando se desmonta
    return () => {
      document.body.classList.remove("diagramador-mode");
    };
  }, []);

  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [zoom, setZoom] = useState(0.85);
  const [_selectedDevice, _setSelectedDevice] = useState<DeviceKey>("phoneStandard");

  const setSelectedDevice = (d: DeviceKey) => {
    _setSelectedDevice(d);
    deviceRef.current = d;
  };
  type Invitacion = {
    idInvitacion: string;
    idUsuario: string;
    estado: "pendiente" | "aceptada" | "rechazada";
    usuario?: {
      nombre: string;
    };
  };

  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab1", name: "Pantalla 1", elementos: [] },
  ]);
  const [selectedTabId, setSelectedTabId] = useState("tab1");
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteUuid, setInviteUuid] = useState("");
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);
  const [propsPanelCollapsed, setPropsPanelCollapsed] = useState(false);

  const tabsRef = useRef(tabs);
  const deviceRef = useRef<DeviceKey>("phoneStandard");
  useEffect(() => { tabsRef.current = tabs; }, [tabs]);
  useEffect(() => {
    if (!projectId) return;

    guardarProyectoOffline({
      id: projectId,
      nombre: nombreProyecto,
      contenido: {
        pestañas: tabs,
        clases: [], // si no tenés clases aún, igual lo dejamos vacío
        relaciones: [],
        clavesPrimarias: {},
      },
      actualizadoEn: Date.now(), // este campo lo añade internamente en la función, así que se puede omitir
    });
  }, [tabs, nombreProyecto, projectId]);

  useEffect(() => { deviceRef.current = _selectedDevice; }, [_selectedDevice]);

  const scrollRef = useRef<HTMLDivElement>(null);


  const socketRef = useRef<any>(null);

  const cursorTabsRef = useRef<{ [socketId: string]: string }>({});
  const online = useOnlineStatus();

useEffect(() => {
  if (!online || !projectId) return;

  const sincronizar = async () => {
    try {
      const proyecto = await db.proyectosOffline.get(projectId);
      const cambios = await db.cambiosPendientes
        .where("proyectoId")
        .equals(projectId)
        .sortBy("timestamp");

      if (!proyecto || !proyecto.contenido) return;

      // 1. Clonar el contenido
      const actualizado = structuredClone(proyecto.contenido);

      // 2. Aplicar cambios pendientes
      for (const cambio of cambios) {
        const pestaña = actualizado.pestañas.find((p: any) =>
          p.elementos.some((e: any) => e.id === cambio.elementoId)
        );

        if (cambio.tipo === "borrado") {
          for (const tab of actualizado.pestañas) {
            tab.elementos = tab.elementos.filter((el: any) => el.id !== cambio.elementoId);
          }
        } else if (cambio.tipo === "nuevo") {
          // asumimos que datos.tabId existe
          const tab = actualizado.pestañas.find((t: any) => t.id === cambio.datos.tabId);
          if (tab) tab.elementos.push(cambio.datos);
        } else if (cambio.tipo === "actualizacion") {
          if (pestaña) {
            pestaña.elementos = pestaña.elementos.map((el: any) =>
              el.id === cambio.elementoId ? cambio.datos : el
            );
          }
        }
      }

      // 3. Enviar al servidor
      await axiosInstance.put(`/proyectos/${projectId}`, {
        contenido: JSON.stringify(actualizado),
      });

      // 4. Limpiar cambios locales
      await db.cambiosPendientes.where("proyectoId").equals(projectId).delete();

      // 5. Actualizar copia local
      await guardarProyectoOffline({
        id: projectId,
        nombre: proyecto.nombre,
        contenido: actualizado,
        actualizadoEn: Date.now(),
      });

      console.log("✅ Proyecto sincronizado con éxito");
    } catch (e) {
      console.error("❌ Error al sincronizar cambios pendientes", e);
    }
  };

  sincronizar();
}, [online, projectId]);




  //nueva implementación de cursores
  const selectedTabRef = useRef(selectedTabId);
  useEffect(() => {
    selectedTabRef.current = selectedTabId;
  }, [selectedTabId]);
  const cursorsRef = useRef<{ [socketId: string]: HTMLDivElement }>({});
  const cursorLayerRef = useRef<HTMLDivElement | null>(null);
  const mySocketIdRef = useRef<string>("");
  function colorFromSocketId(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    const h = hash % 360;
    return `hsl(${h}, 80%, 70%)`;
  }

  useEffect(() => {
    const scroll = scrollRef.current;
    const realCanvas = scroll?.querySelector("div > div");
    if (!realCanvas) return;

    (realCanvas as HTMLElement).style.position = "relative";

    const layer = document.createElement("div");
    Object.assign(layer.style, {
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
      overflow: "hidden",
      zIndex: "50",
    });

    (realCanvas as HTMLElement).appendChild(layer);
    cursorLayerRef.current = layer;

    return () => {
      (realCanvas as HTMLElement).removeChild(layer);
      cursorLayerRef.current = null;
    };
  }, []);
  // ---  selecciones remotas  ---
  type RemoteSel = {
    socketId: string;
    tabId: string;
    elementId: string | null;
    name: string;
    color: string;          // ← nuevo
  };

  const remoteSelectionsRef = useRef<{ [socketId: string]: RemoteSel }>({});
  const [remoteSelVersion, setRemoteSelVersion] = useState(0); // fuerza rerender

  // Avisar a los demás qué elemento tengo seleccionado
  useEffect(() => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("selectElement", {
      projectId,
      tabId: selectedTabId,
      elementId: selectedElementId,                    // puede ser null
      name: localStorage.getItem("nombre") || "Invitado",
      socketId: mySocketIdRef.current,
      color: colorFromSocketId(mySocketIdRef.current),  // ← NUEVO
    });
  }, [selectedElementId, selectedTabId, projectId]);
  useEffect(() => {
    setRemoteSelVersion(v => v + 1);   // rehace el filtro por tab
  }, [selectedTabId]);





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
    const canvas = scrollRef.current;
    if (!canvas) return;

    const handleMove = (e: MouseEvent) => {
      if (!socketRef.current?.connected) return;
      const canvas = scrollRef.current;
      const realCanvas = canvas?.querySelector("div > div"); // ⬅️ el div interno del canvas

      if (!canvas || !realCanvas) return;

      const rect = canvas.getBoundingClientRect();
      const realWidth = realCanvas.scrollWidth;
      const realHeight = realCanvas.scrollHeight;

      if (
        e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top || e.clientY > rect.bottom
      ) {
        socketRef.current.emit("cursorLeave", { projectId, socketId: mySocketIdRef.current });
        return;
      }

      const rx = (e.clientX - rect.left + canvas.scrollLeft) / realWidth;
      const ry = (e.clientY - rect.top + canvas.scrollTop) / realHeight;

      socketRef.current.emit("cursorMove", {
        projectId,
        tabId: selectedTabId,
        name: localStorage.getItem("nombre") || "Invitado",
        rx,
        ry,
        socketId: mySocketIdRef.current,
      });
    };


    canvas.addEventListener("mousemove", handleMove);
    return () => canvas.removeEventListener("mousemove", handleMove);
  }, [selectedTabId]);

  useEffect(() => {
    if (!projectId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000");
    socketRef.current = socket;
    socket.on("selectElement", (data: RemoteSel & { projectId: string }) => {
      if (data.projectId !== projectId || data.socketId === mySocketIdRef.current) return;

      if (!data.elementId) {
        delete remoteSelectionsRef.current[data.socketId];      // des-selección
      } else {
        remoteSelectionsRef.current[data.socketId] = data;      // 🔹 ahora `data` YA trae `color`
      }
      setRemoteSelVersion(v => v + 1);
    });


    socket.on("connect", () => {
      mySocketIdRef.current = socket.id ?? ""; // ✅ evitás undefined

      socket.emit("joinProject", { projectId });
    });
    socket.on("tabsSnapshot", (data: { projectId: string; socketId: string; tabs: { id: string; name: string }[] }) => {
      if (data.projectId !== projectId || data.socketId === (mySocketIdRef.current ?? "")) return;

      setTabs((prev) => {
        const cache = Object.fromEntries(prev.map((t) => [t.id, t]));
        const merged = data.tabs.map((t) =>
          cache[t.id] ? { ...cache[t.id], name: t.name } : { id: t.id, name: t.name, elementos: [] }
        );
        if (!merged.find((t) => t.id === selectedTabId)) {
          setSelectedTabId(merged[0].id);
        }
        return merged;
      });
    });

    socket.on("cursorLeave", ({ socketId }: { socketId: string }) => {
      const el = cursorsRef.current[socketId];
      if (el) {
        el.remove();
        delete cursorsRef.current[socketId];
        delete cursorTabsRef.current[socketId]; // ← 👈 esta línea nueva
      }
    });


    socket.on("cursorMove", (data) => {
      if (data.projectId !== projectId || data.socketId === mySocketIdRef.current) return;
      cursorTabsRef.current[data.socketId] = data.tabId;
      if (data.tabId !== selectedTabRef.current) return; // ← usa el valor vivo

      const canvas = scrollRef.current;
      const realCanvas = canvas?.querySelector("div > div");
      if (!canvas || !realCanvas || !cursorLayerRef.current) return;

      const realWidth = realCanvas.scrollWidth;
      const realHeight = realCanvas.scrollHeight;
      const x = data.rx * realWidth;
      const y = data.ry * realHeight;

      // Ignorar si está fuera del canvas
      if (x < 0 || y < 0 || x > realWidth || y > realHeight) return;

      let el = cursorsRef.current[data.socketId];
      if (!el) {
        el = document.createElement("div");
        el.textContent = data.name;
        Object.assign(el.style, {
          position: "absolute",
          transform: "translate(-50%,-120%)",
          background: colorFromSocketId(data.socketId),
          color: "#fff",
          padding: "2px 6px",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: "bold",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        });
        cursorLayerRef.current.appendChild(el);
        cursorsRef.current[data.socketId] = el;
      }

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.display = "block";
    });

    socket.on("canvasUpdate", (data: { projectId: string; tabId: string; socketId: string; elementos: Elemento[] }) => {
      if (data.projectId !== projectId || data.socketId === mySocketIdRef.current) return;

      setTabs((prev) =>
        prev.map((t) =>
          t.id === data.tabId ? { ...t, elementos: data.elementos } : t
        )
      );
    });



    return () => {
      socket.disconnect(); // ✅ función válida para cleanup
    };
  }, [projectId]);
  useEffect(() => {
    for (const socketId in cursorsRef.current) {
      const tabId = cursorTabsRef.current[socketId];
      const el = cursorsRef.current[socketId];
      if (!el) continue;

      el.style.display = tabId === selectedTabId ? "block" : "none";
    }
  }, [selectedTabId]);

  useEffect(() => {
    const leave = () => {
      socketRef.current?.emit("cursorLeave", {
        projectId,
        socketId: mySocketIdRef.current,
      });
    };
    const canvas = scrollRef.current;
    canvas?.addEventListener("mouseleave", leave);
    return () => canvas?.removeEventListener("mouseleave", leave);
  }, []);


  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (showInvite) cargarInvitaciones();
  }, [showInvite]);

  useEffect(() => {
    if (!projectId || intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      guardarProyecto();
    }, 10000); // cada 10 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
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

  const exportarProyecto = async () => {
    try {
      await guardarProyecto();  // 👈 forzamos un guardado antes
      await new Promise((res) => setTimeout(res, 300)); // 👈 pausa de 300ms
      const { data } = await axiosInstance.get(`/proyectos/${projectId}/exportar-flutter`, {
        responseType: 'blob',
      });
      const blob = new Blob([data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${nombreProyecto || 'exportacion'}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error al exportar proyecto", error);
      alert("Ocurrió un error al exportar el proyecto.");
    }
  };
  const cargarInvitaciones = async () => {
    try {
      const { data } = await axiosInstance.get(`/invitaciones/proyecto/${projectId}`);
      setInvitaciones(data);
    } catch (e) {
      console.error("invites", e);
    }
  };

  const enviarInvitacion = async () => {
    if (!inviteUuid.trim()) return;
    try {
      await axiosInstance.post("/invitaciones", {
        idProyecto: projectId,
        idUsuario: inviteUuid.trim()
      });
      setInviteUuid("");
      await cargarInvitaciones();
      alert("✅ Invitación enviada");
    } catch (e) {
      console.error("invite", e);
      alert("❌ Error al enviar invitación");
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
    const newTabs = [...tabs, { id: newId, name: newName, elementos: [] }];
    setTabs(newTabs);
    setSelectedTabId(newId);

    emitirTabsSnapshot(newTabs);
  };

  const handleRenameTab = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (trimmed === "") return;
    if (tabs.some((t) => t.name === trimmed && t.id !== id)) {
      alert("Ya existe otra pestaña con ese nombre");
      return;
    }

    const newTabs = tabs.map((t) => (t.id === id ? { ...t, name: trimmed } : t));
    setTabs(newTabs);

    emitirTabsSnapshot(newTabs);
  };


  const handleDeleteTab = (id: string) => {
    if (tabs.length === 1) {
      alert("No puedes eliminar la única pestaña");
      return;
    }

    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
    if (selectedTabId === id) {
      setSelectedTabId(newTabs[0].id);
    }

    emitirTabsSnapshot(newTabs);
  };

  const emitirTabsSnapshot = (updatedTabs: Tab[]) => {
    socketRef.current?.emit("tabsSnapshot", {
      projectId,
      socketId: mySocketIdRef.current,
      tabs: updatedTabs.map(({ id, name }) => ({ id, name }))
    });
  };

  const updateElementos = (
    tabId: string,
    updater: (prev: Elemento[]) => Elemento[]
  ) => {
    setTabs((prev) => {
      const updated = prev.map((tab) =>
        tab.id === tabId ? { ...tab, elementos: updater(tab.elementos) } : tab
      );

      // 🔄 Emitimos los nuevos elementos al servidor
      const newTab = updated.find((t) => t.id === tabId);
      if (newTab) {
        socketRef.current?.emit("canvasUpdate", {
          projectId,
          tabId,
          socketId: mySocketIdRef.current,
          elementos: newTab.elementos,
        });

        // 🧠 Guardar cambios offline si no hay conexión
        if (!online) {
          for (const el of newTab.elementos) {
            guardarCambioOffline({
              proyectoId: projectId!,
              tipo: "actualizacion",
              elementoId: el.id,
              datos: el,
            });
          }
        }
      }

      return updated;
    });
  };



  const selectedTab = tabs.find((t) => t.id === selectedTabId);
  const selectedElement = selectedTab?.elementos.find((el) => el.id === selectedElementId) ?? null;
  const device = DEVICES[_selectedDevice];

  const updateElemento = (fn: (el: Elemento) => Elemento) => {
    if (!selectedElementId || !selectedTab) return;

    setTabs((prev) => {
      const updated = prev.map((tab) =>
        tab.id === selectedTab.id
          ? {
            ...tab,
            elementos: tab.elementos.map((el) =>
              el.id === selectedElementId ? fn(el) : el
            ),
          }
          : tab
      );

      const newTab = updated.find((t) => t.id === selectedTab.id);
      if (newTab) {
        socketRef.current?.emit("canvasUpdate", {
          projectId,
          tabId: newTab.id,
          socketId: mySocketIdRef.current,
          elementos: newTab.elementos,
        });

        // 🆕 guardar cambio offline
        if (!online) {
          const actualizado = newTab.elementos.find(el => el.id === selectedElementId);
          if (actualizado) {
            guardarCambioOffline({
              proyectoId: projectId!,
              tipo: "actualizacion",
              elementoId: actualizado.id,
              datos: actualizado,
            });
          }
        }
      }

      return updated;
    });
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

    // 🔌 Si está offline, registrar el borrado
    if (!online && projectId) {
      guardarCambioOffline({
        proyectoId: projectId,
        tipo: "borrado",
        elementoId: selectedElementId,
        datos: null,
      });
    }

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

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: isSaving ? "#fbbf24" : "#10b981" }}>
            {isSaving ? "Guardando…" : "Guardado"}
          </span>
          <button
            onClick={() => setShowInvite(true)}
            style={{
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Invitar
          </button>
          <button
            onClick={exportarProyecto}
            style={{
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Exportar
          </button>
        </div>
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
          online={online}
        />

        {/* Zona principal */}
        <div style={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
          {/* Paleta */}
          <div
            style={{
              width: paletteCollapsed ? 10 : 200,
              minWidth: paletteCollapsed ? 10 : 200,
              maxWidth: paletteCollapsed ? 10 : 200,
              flexShrink: 0,
              backgroundColor: "#f7f7f7",
              borderRight: "1px solid #ccc",
              padding: 10,
              boxSizing: "border-box",
            }}
          >
            <SidebarPaleta
              collapsed={paletteCollapsed}
              onToggle={() => setPaletteCollapsed(!paletteCollapsed)}
            />
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
              position: "relative", // 👈 ESTA LÍNEA FALTA
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
                  remoteSelections={Object.values(remoteSelectionsRef.current)
                    .filter(sel => sel.tabId === selectedTabId)}
                />
              )}
            </div>
          </div>

          {/* Panel de propiedades con scroll */}
          <div
            style={{
              width: propsPanelCollapsed ? 10 : 280,
              minWidth: propsPanelCollapsed ? 10 : 280,
              maxWidth: propsPanelCollapsed ? 10 : 280,
              backgroundColor: "#fafafa",
              borderLeft: "1px solid #ccc",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ flex: 1, overflowY: "auto", padding: propsPanelCollapsed ? 0 : 10 }}>
              <PropiedadesPanel
                elemento={selectedElement}
                onUpdate={updateElemento}
                canvasHeight={device.height}
                proyectoId={projectId!}
                collapsed={propsPanelCollapsed}
                onToggle={() => setPropsPanelCollapsed(!propsPanelCollapsed)}
              />
            </div>
          </div>

        </div>
      </div>

      {showInvite && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "#fff", padding: 24, borderRadius: 8,
            width: 380, maxHeight: "80vh", display: "flex",
            flexDirection: "column", gap: 16, overflowY: "auto"
          }}>
            <h3 style={{ margin: 0 }}>Compartir proyecto</h3>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                placeholder="UUID del usuario…"
                value={inviteUuid}
                onChange={(e) => setInviteUuid(e.target.value)}
                style={{
                  flex: 1, padding: "8px 10px", borderRadius: 6,
                  border: "1px solid #d1d5db"
                }}
              />
              <button
                onClick={enviarInvitacion}
                style={{
                  background: "#2563eb", color: "#fff", padding: "8px 12px",
                  border: "none", borderRadius: 6, cursor: "pointer"
                }}
              >
                Invitar
              </button>
            </div>

            <hr />
            <h4 style={{ margin: "4px 0" }}>Invitaciones</h4>
            {invitaciones.length === 0 && <p>No hay invitaciones.</p>}
            {invitaciones.map(inv => (
              <div key={inv.idInvitacion} style={{
                padding: 6, borderBottom: "1px solid #e5e7eb",
                display: "flex", justifyContent: "space-between", fontSize: 14
              }}>
                <span>{inv.usuario?.nombre || inv.idUsuario}</span>
                <span style={{ fontWeight: "bold" }}>
                  {inv.estado === "pendiente" ? "🟡 Pendiente"
                    : inv.estado === "aceptada" ? "🟢 Aceptada"
                      : "🔴 Rechazada"}
                </span>
              </div>
            ))}

            <button
              onClick={() => setShowInvite(false)}
              style={{
                marginTop: 8, alignSelf: "flex-end", background: "#ef4444",
                color: "#fff", padding: "8px 12px", border: "none",
                borderRadius: 6, cursor: "pointer"
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </DndProvider>
  );
}
