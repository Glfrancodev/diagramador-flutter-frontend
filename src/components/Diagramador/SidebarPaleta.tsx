import { useDrag } from 'react-dnd';

const COMPONENTES = [
  { tipo: "Label", label: "Etiqueta" },
  { tipo: "InputBox", label: "Campo de texto" },
  { tipo: "InputFecha", label: "Fecha" },
  { tipo: "Boton", label: "Botón" },
  { tipo: "Selector", label: "Selector" },
  { tipo: "Checkbox", label: "Checkbox" },
  { tipo: "Tabla", label: "Tabla" },
  { tipo: "Link", label: "Enlace" },
  { tipo: "Sidebar", label: "Sidebar" },
  { tipo: "Imagen", label: "Imagen" },
  { tipo: "Video", label: "Video" },
  { tipo: "Audio", label: "Audio" },
];

export default function SidebarPaleta() {
  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingRight: 6 }}>
      <h3 style={{ marginTop: 0 }}>Paleta</h3>
      {COMPONENTES.map((c) => (
        <DraggableItem key={c.tipo} tipo={c.tipo} label={c.label} />
      ))}
    </div>
  );
}

function DraggableItem({ tipo, label }: { tipo: string; label: string }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'COMPONENTE',
    item: { tipo },
    collect: (mon) => ({ isDragging: mon.isDragging() }),
  }));

  return (
    <div
      ref={(n) => {
        if (n) dragRef(n);
      }}
      style={{
        padding: 8,
        marginBottom: 10,
        background: isDragging ? '#ddd' : '#fff',
        border: '1px solid #999',
        borderRadius: 4,
        cursor: 'grab',
        userSelect: 'none',
      }}
    >
      {label}
    </div>
  );
}
