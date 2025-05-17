// src/components/Diagramador/CanvasEditor.tsx
import { useDrop } from "react-dnd";
import { Rnd } from "react-rnd";

export type Elemento = {
  id: string;
  tipo: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  tabId: string;
  zoom: number;
  width: number;
  height: number;
  elementos: Elemento[];
  onChange: (tabId: string, updater: (prev: Elemento[]) => Elemento[]) => void;
};

export default function CanvasEditor({
  tabId,
  zoom,
  width,
  height,
  elementos,
  onChange,
}: Props) {
  // ID único para evitar colisiones si llegas a renderizar varios canvases a la vez
  const canvasId = `canvas-area-${tabId}`;

  const [, dropRef] = useDrop(
    () => ({
      accept: "COMPONENTE",
      drop: (item: { tipo: string }, monitor) => {
        const offset = monitor.getClientOffset();
        if (!offset) return;

        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (offset.x - rect.left) / zoom;
        const y = (offset.y - rect.top) / zoom;

        const nuevo: Elemento = {
          id: crypto.randomUUID(),
          tipo: item.tipo,
          x,
          y,
          width: 120,
          height: 40,
        };

        // El elemento se añade a la pestaña actualmente activa
        onChange(tabId, (prev) => [...prev, nuevo]);
      },
    }),
    // Dependencias: se recalcula al cambiar de pestaña o de zoom
    [tabId, zoom]
  );

  const handleDragStop = (id: string, xPos: number, yPos: number) => {
    onChange(tabId, (prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, x: xPos / zoom, y: yPos / zoom } : el
      )
    );
  };

  const handleResizeStop = (
    id: string,
    xPos: number,
    yPos: number,
    w: number,
    h: number
  ) => {
    onChange(tabId, (prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              x: xPos / zoom,
              y: yPos / zoom,
              width: w / zoom,
              height: h / zoom,
            }
          : el
      )
    );
  };

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 20,
      }}
    >
      <div
        id={canvasId}
        ref={(node) => {
          if (node) dropRef(node);
        }}
        style={{
          width: width * zoom,
          height: height * zoom,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          position: "relative",
          transformOrigin: "top left",
        }}
      >
        {elementos.map((el) => (
          <Rnd
            key={el.id}
            bounds="parent"
            size={{
              width: el.width * zoom,
              height: el.height * zoom,
            }}
            position={{
              x: el.x * zoom,
              y: el.y * zoom,
            }}
            onDragStop={(_, data) => handleDragStop(el.id, data.x, data.y)}
            onResizeStop={(_, __, ref, ___, pos) =>
              handleResizeStop(
                el.id,
                pos.x,
                pos.y,
                ref.offsetWidth,
                ref.offsetHeight
              )
            }
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: "move",
              position: "absolute",
              fontSize: 14 * zoom,
            }}
          >
            {el.tipo}
          </Rnd>
        ))}
      </div>
    </div>
  );
}
