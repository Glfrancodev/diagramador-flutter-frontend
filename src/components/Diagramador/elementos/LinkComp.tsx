import React from 'react';

type Props = {
  texto?: string;
  url?: string;
  fontSize?: number; // <- ahora es relativo (0-1)
  color?: string;
  zoom: number;
  canvasHeight: number; // ✅ nuevo
};

const LinkComp: React.FC<Props> = ({
  texto = 'Enlace',
  fontSize = 0.02,
  color = '#2563eb',
  zoom,
  canvasHeight,
}) => {
  const pixelFontSize = (fontSize ?? 0.02) * canvasHeight * zoom;

  return (
    <div
      className="no-drag"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        fontSize: pixelFontSize,
        color,
        textDecoration: 'underline',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        cursor: 'default',
        pointerEvents: 'none',
      }}
    >
      {texto}
    </div>
  );
};

export default LinkComp;
