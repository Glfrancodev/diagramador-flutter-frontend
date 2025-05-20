import React from 'react';

type Props = {
  items?: { texto: string; nombrePestana: string }[]; // nombre visible de la pestaña
  visible: boolean;
  zoom: number;
  onToggle: (next: boolean) => void;
};

const SidebarComp: React.FC<Props> = ({ items = [], visible, zoom, onToggle }) => {
  if (!visible) {
    return (
      <div
        style={{
          width: 32 * zoom,
          height: 32 * zoom,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => onToggle(true)}
          style={{
            width: '100%',
            height: '100%',
            fontSize: 14 * zoom,
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer',
          }}
          title="Mostrar menú"
        >
          ☰
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1f2937',
        color: '#fff',
        padding: 10,
        boxSizing: 'border-box',
        zIndex: 10,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Encabezado con botón para ocultar */}
      <div
        style={{
          marginBottom: 12,
          fontSize: 16 * zoom,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Menú</span>
        <button
          onClick={() => onToggle(false)}
          style={{
            marginLeft: 8,
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 14 * zoom,
            padding: '2px 6px',
            cursor: 'pointer',
          }}
          title="Ocultar menú"
        >
          ☰
        </button>
      </div>

      {items.map((item, i) => (
        <a
          key={i}
          href={`#${item.nombrePestana}`} // referenciamos por nombre
          style={{
            display: 'block',
            padding: '6px 8px',
            fontSize: 14 * zoom,
            color: '#fff',
            textDecoration: 'none',
            backgroundColor: '#374151',
            borderRadius: 4,
            marginBottom: 6,
          }}
        >
          {item.texto}
        </a>
      ))}
    </div>
  );
};

export default SidebarComp;
