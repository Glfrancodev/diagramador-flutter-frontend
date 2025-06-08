import React from 'react';

type CirculoProps = {
  color: string;
  zoom: number;
  canvasHeight: number;
  canvasWidth: number; // Ancho del canvas
};

const Circulo: React.FC<CirculoProps> = ({ color, zoom, canvasHeight, canvasWidth }) => {
  // Ajustamos el tamaño al 100% del contenedor, el zoom afectará proporcionalmente
  const adjustedSize = Math.min(canvasHeight, canvasWidth) * zoom;

  return (
    <div
      style={{
        position: 'absolute', // Aseguramos que esté posicionado dentro del canvas
        width: `${adjustedSize}px`, // Ancho ajustado al contenedor con zoom
        height: `${adjustedSize}px`, // Altura ajustada al contenedor con zoom
        backgroundColor: color,
        borderRadius: '50%', // Esto hace que la figura sea un círculo
        top: '50%', // Centrado verticalmente
        left: '50%', // Centrado horizontalmente
        transform: 'translate(-50%, -50%)', // Para centrar perfectamente
        maxWidth: '100%', // Limitar el tamaño máximo al ancho del canvas
        maxHeight: '100%', // Limitar el tamaño máximo a la altura del canvas
      }}
    ></div>
  );
};

export default Circulo;
