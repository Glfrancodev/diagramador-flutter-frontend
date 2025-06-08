import React from 'react';

type Props = {
  titulo?: string;
  items?: { texto: string; nombrePestana: string }[];
  visible: boolean;
  zoom: number;
  onToggle: (next: boolean) => void;
  fontSize?: number;
  bgColor?: string;
  textColor?: string;
  itemBgColor?: string;
  borderRadius?: number; // ✅ nuevo
  canvasHeight: number;
};

const SidebarComp: React.FC<Props> = ({
  titulo = 'Menú',
  items = [],
  visible,
  zoom,
  onToggle,
  fontSize = 0.02,
  bgColor = '#1f2937',
  textColor = '#ffffff',
  itemBgColor = '#374151',
  borderRadius = 0, // ✅ default
  canvasHeight,
}) => {
  const pixelFontSize = fontSize * canvasHeight * zoom;

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
          borderRadius: borderRadius * zoom, // ✅ aplicado también al botón flotante
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => onToggle(true)}
          style={{
            width: '100%',
            height: '100%',
            fontSize: pixelFontSize,
            background: itemBgColor,
            color: textColor,
            border: 'none',
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
        backgroundColor: bgColor,
        color: textColor,
        padding: 10,
        boxSizing: 'border-box',
        zIndex: 10,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: borderRadius * zoom, // ✅ aplicado
      }}
    >
      {/* encabezado */}
      <div
        style={{
          marginBottom: 12,
          fontSize: pixelFontSize + 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{titulo}</span>
        <button
          onClick={() => onToggle(false)}
          style={{
            marginLeft: 8,
            background: itemBgColor,
            color: textColor,
            border: 'none',
            borderRadius: 4,
            fontSize: pixelFontSize,
            padding: '2px 6px',
            cursor: 'pointer',
          }}
          title="Ocultar menú"
        >
          ☰
        </button>
      </div>

      {/* ítems */}
      {items.map((item, i) => (
        <a
          key={i}
          href={`#${item.nombrePestana}`}
          style={{
            display: 'block',
            padding: '6px 8px',
            fontSize: pixelFontSize,
            color: textColor,
            textDecoration: 'none',
            backgroundColor: itemBgColor,
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
