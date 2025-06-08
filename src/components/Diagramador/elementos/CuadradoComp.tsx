import React from 'react';

type CuadradoProps = {
  color: string;
  zoom: number;
  canvasHeight: number;
  canvasWidth: number; // Ancho del canvas
};

const Cuadrado: React.FC<CuadradoProps> = ({ color, zoom, canvasHeight, canvasWidth }) => {
  // El cuadrado ocupa el 100% del ancho y alto del contenedor
  const adjustedWidth = canvasWidth * zoom;
  const adjustedHeight = canvasHeight * zoom;

  return (
    <div
      style={{
        position: 'absolute', // Aseguramos que esté posicionado dentro del canvas
        width: `${adjustedWidth}px`, // Ancho ajustado al contenedor con zoom
        height: `${adjustedHeight}px`, // Altura ajustada al contenedor con zoom
        backgroundColor: color,
        top: '0', // Se coloca al principio del contenedor
        left: '0', // Se coloca al principio del contenedor
        margin: 'auto',
        overflow: 'hidden', // Limitar que se desborde
        maxWidth: '100%', // Limitar al máximo el tamaño según el contenedor
        maxHeight: '100%', // Limitar al máximo el tamaño según el contenedor
      }}
    ></div>
  );
};

export default Cuadrado;
