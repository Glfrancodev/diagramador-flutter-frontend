// src/components/Diagramador/Diagramador.tsx

import { useState } from "react";
import SidebarPaleta from "./SidebarPaleta";
import CanvasEditor from "./CanvasEditor";
import Toolbar from "./Toolbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DEVICES } from "../../constants/devices";
import type { DeviceKey } from "../../constants/devices";

export default function Diagramador() {
  const [zoom, setZoom] = useState(0.85);
  const [selectedDevice, setSelectedDevice] = useState<DeviceKey>("phoneStandard");

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const resetZoom = () => setZoom(0.85);

  const device = DEVICES[selectedDevice];

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
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

        {/* Cuerpo principal: Sidebar + Viewport */}
        <div style={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
          {/* Sidebar fijo */}
          <SidebarPaleta />

          {/* Contenedor scrollable */}
          <div
            style={{
              flexGrow: 1,
              overflow: "auto",
              backgroundColor: "#f0f0f0",
              padding: 20,
              display: "flex",
              justifyContent: "flex-start", // ← importante
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "inline-block" }}>
              <CanvasEditor zoom={zoom} width={device.width} height={device.height} />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
