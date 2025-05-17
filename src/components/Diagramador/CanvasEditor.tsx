import { useDrop } from "react-dnd";
import { useState } from "react";
import { Rnd } from "react-rnd";

type Elemento = {
  id: string;
  tipo: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function CanvasEditor({
  zoom,
  width,
  height,
}: {
  zoom: number;
  width: number;
  height: number;
}) {
  const [elementos, setElementos] = useState<Elemento[]>([]);

  const [, dropRef] = useDrop(() => ({
    accept: "COMPONENTE",
    drop: (item: { tipo: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const canvas = document.getElementById("canvas-area");
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (offset.x - rect.left) / zoom;
      const y = (offset.y - rect.top) / zoom;

      setElementos((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          tipo: item.tipo,
          x,
          y,
          width: 120,
          height: 40,
        },
      ]);
    },
  }));

  const handleDragStop = (id: string, x: number, y: number) => {
    setElementos((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, x: x / zoom, y: y / zoom } : el
      )
    );
  };

  const handleResizeStop = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    setElementos((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              x: x / zoom,
              y: y / zoom,
              width: width / zoom,
              height: height / zoom,
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
        id="canvas-area"
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
            onResizeStop={(_, __, ref, delta, pos) =>
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
