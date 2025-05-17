// src/components/Diagramador/SidebarPaleta.tsx

import { useDrag } from "react-dnd";

const COMPONENTES = [
  { tipo: "Boton", label: "Botón" },
  // puedes agregar más componentes aquí
];

export default function SidebarPaleta() {
  return (
    <div
      style={{
        width: 200,
        backgroundColor: "#f7f7f7",
        borderRight: "1px solid #ccc",
        padding: 10,
      }}
    >
      <h3>Paleta</h3>
      {COMPONENTES.map((comp) => (
        <DraggableItem key={comp.tipo} tipo={comp.tipo} label={comp.label} />
      ))}
    </div>
  );
}

function DraggableItem({ tipo, label }: { tipo: string; label: string }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "COMPONENTE",
    item: { tipo },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        if (node) dragRef(node);
      }}
      style={{
        padding: 8,
        marginBottom: 10,
        backgroundColor: isDragging ? "#ddd" : "#fff",
        border: "1px solid #999",
        borderRadius: 4,
        cursor: "grab",
        userSelect: "none",
      }}
    >
      {label}
    </div>
  );
}
