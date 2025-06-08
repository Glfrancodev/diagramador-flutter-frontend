import React from 'react';

type Props = {
  texto?: string;
  fontSize?: number;       // ← proporcional
  zoom: number;
  canvasHeight: number;
};

const CheckboxComp: React.FC<Props> = ({
  texto = 'Opción',
  fontSize = 0.02,
  zoom,
  canvasHeight,
}) => {
  const textPx = fontSize * canvasHeight * zoom;
  const boxPx = 0.022 * canvasHeight * zoom; // ✅ tamaño fijo pero responsive

  return (
    <label className="no-drag" style={{
      display: 'flex',
      alignItems: 'center',
      fontSize: textPx,
      gap: 8,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    }}>
      <input
        type="checkbox"
        style={{
          width: boxPx,
          height: boxPx,
          flexShrink: 0,
          accentColor: '#2563eb', // opcional
        }}
      />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", flexGrow: 1 }}>
        {texto}
      </span>
    </label>
  );
};

export default CheckboxComp;
