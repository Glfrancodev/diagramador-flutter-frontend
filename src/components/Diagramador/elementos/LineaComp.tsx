import React from 'react';

type LineaProps = {
  color: string;
  canvasHeight: number;
  canvasWidth: number; // Ancho del canvas
};

const Linea: React.FC<LineaProps> = ({ color }) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%', // Ajustamos al 100% del ancho del contenedor
        height: '2px', // La altura de la línea es constante (delgada)
        backgroundColor: color,
        top: '50%', // Centra la línea verticalmente
        left: 0, // Se coloca en el borde izquierdo del contenedor
        transform: 'translateY(-50%)', // Ajusta la línea para que esté perfectamente centrada
        margin: 'auto',
        overflow: 'hidden',
      }}
    ></div>
  );
};

export default Linea;
