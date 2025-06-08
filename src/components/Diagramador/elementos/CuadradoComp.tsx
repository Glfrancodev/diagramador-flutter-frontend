import React from 'react';

type CuadradoProps = {
  color: string;
  zoom: number;
  canvasHeight: number;
  canvasWidth: number; // Ancho del canvas
};

const Cuadrado: React.FC<CuadradoProps> = ({ color, zoom, canvasHeight, canvasWidth }) => {
  // Ajustamos el tamaño al 100% del contenedor, el zoom afectará proporcionalmente
  const adjustedSize = Math.min(canvasHeight, canvasWidth) * zoom;

  return (
    <div
      style={{
        position: 'absolute', // Aseguramos que esté posicionado dentro del canvas
        width: `${adjustedSize}px`, // Ancho ajustado al contenedor con zoom
        height: `${adjustedSize}px`, // Altura ajustada al contenedor con zoom
        backgroundColor: color,
        top: '50%', // Centrado verticalmente
        left: '50%', // Centrado horizontalmente
        transform: 'translate(-50%, -50%)', // Para centrar perfectamente
        maxWidth: '100%', // Limitar al máximo el tamaño según el contenedor
        maxHeight: '100%', // Limitar al máximo el tamaño según el contenedor
      }}
    ></div>
  );
};

export default Cuadrado;
