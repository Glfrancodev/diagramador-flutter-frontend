// src/components/Diagramador/elementos/SelectorComp.tsx
import React from 'react';

type Props = {
  options?: string[];
  fontSize?: number;       // ← valor relativo (0.02, por ejemplo)
  zoom: number;
  canvasHeight: number;    // ← nuevo
};

const SelectorComp: React.FC<Props> = ({
  options = ['Opción 1', 'Opción 2'],
  fontSize = 0.02, // relativo
  zoom,
  canvasHeight,
}) => {
  const px = fontSize * canvasHeight * zoom;

  return (
    <select
      className="no-drag"
      style={{
        width: '100%',
        height: '100%',
        fontSize: px,
        padding: '4px 8px',
        border: '1px solid #ccc',
        borderRadius: 4,
        background: '#fff',
        color: '#333',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
    >
      {options.map((op, i) => (
        <option key={i}>{op}</option>
      ))}
    </select>
  );
};

export default SelectorComp;
