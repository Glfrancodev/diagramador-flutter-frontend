// src/components/Diagramador/Diagramador.tsx

import { useState } from "react";
import SidebarPaleta from "./SidebarPaleta";
import CanvasEditor from "./CanvasEditor";
import Toolbar from "./Toolbar";
import TabsBar from "./TabsBar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DEVICES } from "../../constants/devices";
import type { DeviceKey } from "../../constants/devices";

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
  const [zoom, setZoom] = useState(0.85);
  const [selectedDevice, setSelectedDevice] = useState<DeviceKey>("phoneStandard");

  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab1", name: "Pantalla 1", elementos: [] },
  ]);
  const [selectedTabId, setSelectedTabId] = useState("tab1");

  const selectedTab = tabs.find((t) => t.id === selectedTabId);
  const device = DEVICES[selectedDevice];

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const resetZoom = () => setZoom(0.85);

  const handleAddTab = () => {
    let index = tabs.length + 1;
    let newName = `Pantalla ${index}`;

    // Asegurar nombre único
    while (tabs.some((t) => t.name === newName)) {
      index++;
      newName = `Pantalla ${index}`;
    }

    const newId = `tab${Date.now()}`; // ID único
    const newTab: Tab = {
      id: newId,
      name: newName,
      elementos: [],
    };

    setTabs((prev) => [...prev, newTab]);
    setSelectedTabId(newId);
  };

  const handleRenameTab = (id: string, newName: string) => {
    const trimmed = newName.trim();

    if (trimmed === "") return;
    if (tabs.some((t) => t.name === trimmed && t.id !== id)) {
      alert("Ya existe otra pestaña con ese nombre.");
      return;
    }

    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, name: trimmed } : tab))
    );
  };

  const handleDeleteTab = (id: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));

    if (selectedTabId === id) {
      const remaining = tabs.filter((t) => t.id !== id);
      if (remaining.length > 0) {
        setSelectedTabId(remaining[0].id);
      } else {
        const nueva = { id: "tab1", name: "Pantalla 1", elementos: [] };
        setTabs([nueva]);
        setSelectedTabId(nueva.id);
      }
    }
  };

  const updateElementos = (tabId: string, updater: (prev: Elemento[]) => Elemento[]) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, elementos: updater(tab.elementos) } : tab
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Pestañas */}
        <TabsBar
          tabs={tabs}
          selectedTabId={selectedTabId}
          onSelect={setSelectedTabId}
          onAddTab={handleAddTab}
          onRenameTab={handleRenameTab}
          onDeleteTab={handleDeleteTab}
        />

        {/* Toolbar */}
        <div style={{ flexShrink: 0 }}>
          <Toolbar
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            resetZoom={resetZoom}
            selectedDevice={selectedDevice}
            onDeviceChange={setSelectedDevice}
          />
        </div>

        {/* Cuerpo principal */}
        <div style={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
          <SidebarPaleta />

          <div
            style={{
              flexGrow: 1,
              overflow: "auto",
              backgroundColor: "#f0f0f0",
              padding: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "inline-block" }}>
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
