import React from 'react';

type CuadradoProps = {
  color: string;
  zoom: number;
  canvasHeight: number;
  canvasWidth: number;
  borderRadius?: number;
  borderCorners?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
};

const Cuadrado: React.FC<CuadradoProps> = ({
  color,
  zoom,
  canvasHeight,
  canvasWidth,
  borderRadius = 0,
  borderCorners
}) => {
  const adjustedWidth = canvasWidth * zoom;
  const adjustedHeight = canvasHeight * zoom;

  // Aplica el radio sólo a la esquina seleccionada
  const borderStyle: React.CSSProperties = {
    borderTopLeftRadius: borderCorners!.topLeft ? `${borderRadius}px` : 0,
    borderTopRightRadius: borderCorners!.topRight ? `${borderRadius}px` : 0,
    borderBottomLeftRadius: borderCorners!.bottomLeft ? `${borderRadius}px` : 0,
    borderBottomRightRadius: borderCorners!.bottomRight ? `${borderRadius}px` : 0,
  };

  return (
    <div
      style={{
        position: 'absolute',
        width: `${adjustedWidth}px`,
        height: `${adjustedHeight}px`,
        backgroundColor: color,
        top: '0',
        left: '0',
        margin: 'auto',
        overflow: 'hidden',
        maxWidth: '100%',
        maxHeight: '100%',
        ...borderStyle,
      }}
    ></div>
  );
};

export default Cuadrado;
