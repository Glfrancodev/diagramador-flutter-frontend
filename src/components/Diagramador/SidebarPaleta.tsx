import { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';

const CATEGORIAS = [
  {
    nombre: "Básicos",
    componentes: [
      { tipo: "Label", label: "Etiqueta" },
      { tipo: "InputBox", label: "Campo de texto" },
      { tipo: "InputFecha", label: "Fecha" },
      { tipo: "Selector", label: "Selector" },
      { tipo: "Checkbox", label: "Checkbox" },
      { tipo: "Boton", label: "Botón" },
      { tipo: "Link", label: "Enlace" },
      { tipo: "Tabla", label: "Tabla" },
    ],
  },
  {
    nombre: "Figuras",
    componentes: [
      { tipo: "Cuadrado", label: "Cuadrado" },
      { tipo: "Circulo", label: "Círculo" },
    ],
  },
  {
    nombre: "Navegación",
    componentes: [
      { tipo: "Sidebar", label: "Sidebar" },
      { tipo: 'BottomNavbar', label: 'Barra inferior' }

    ],
  },
  {
    nombre: "Multimedia",
    componentes: [
      { tipo: "Imagen", label: "Imagen" },
      { tipo: "Video", label: "Video" },
      { tipo: "Audio", label: "Audio" },
    ],
  },
];

export default function SidebarPaleta() {
  const [abierto, setAbierto] = useState<{ [key: string]: boolean }>({});

  const toggle = (categoria: string) => {
    setAbierto((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingRight: 6 }}>
      <h3 style={{ marginTop: 0 }}>Paleta</h3>
      {CATEGORIAS.map((cat) => (
        <div key={cat.nombre} style={{ marginBottom: 10 }}>
          <div
            onClick={() => toggle(cat.nombre)}
            style={{
              cursor: 'pointer',
              fontWeight: 'bold',
              background: '#eee',
              padding: 6,
              borderRadius: 4,
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ color: '#000', display: 'inline-block', width: 16 }}>
              {abierto[cat.nombre] ? 'ᐁ' : 'ᐅ'}
            </span>
            {cat.nombre}
          </div>
          {abierto[cat.nombre] && (
            <div style={{ paddingLeft: 8, marginTop: 6 }}>
              {cat.componentes.map((c) => (
                <DraggableItem key={c.tipo} tipo={c.tipo} label={c.label} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DraggableItem({ tipo, label }: { tipo: string; label: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENTE',
    item: { tipo },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      drag(ref);
    }
  }, [drag]);

  return (
    <div
      ref={ref}
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
