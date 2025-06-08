// src/components/Diagramador/elementos/InputBoxComp.tsx
import React from "react";

type Props = {
  placeholder?: string;
  fontSize?: number;     // ← valor relativo
  zoom: number;
  canvasHeight: number;  // ← necesario para convertir a px reales
};

const InputBoxComp: React.FC<Props> = ({
  placeholder = '',
  fontSize = 0.02,
  zoom,
  canvasHeight,
}) => {
  const px = fontSize * canvasHeight * zoom;

  return (
    <input
      className="no-drag"
      type="text"
      placeholder={placeholder}
      style={{
        width: '100%',
        height: '100%',
        fontSize: px, // ✅ ahora es proporcional
        padding: '4px 8px',
        border: '1px solid #ccc',
        borderRadius: 4,
        color: '#333',
        boxSizing: 'border-box',
      }}
    />
  );
};

export default InputBoxComp;
