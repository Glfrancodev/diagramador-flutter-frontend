// src/components/Diagramador/Diagramador.tsx

import { useState } from "react";
import SidebarPaleta from "./SidebarPaleta";
import CanvasEditor from "./CanvasEditor";
import Toolbar from "./Toolbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Diagramador() {
  const [zoom, setZoom] = useState(0.9);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const resetZoom = () => setZoom(0.9);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Toolbar (Header superior) */}
        <div style={{ flexShrink: 0 }}>
          <Toolbar zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom} />
        </div>

        {/* Cuerpo principal: Sidebar + Canvas */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <SidebarPaleta />
          <CanvasEditor zoom={zoom} />
        </div>
      </div>
    </DndProvider>
  );
}
