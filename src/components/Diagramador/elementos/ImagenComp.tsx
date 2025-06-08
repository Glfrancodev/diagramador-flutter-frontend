import React from 'react';

type Props = {
  idArchivo?: string;
  zoom: number;
  borderRadius?: number;
};

const ImagenComp: React.FC<Props> = ({ idArchivo, zoom, borderRadius = 0 }) => {
  const src = idArchivo
    ? `http://localhost:3000/api/archivos/${idArchivo}/descargar`
    : null;

  return (
    <div
      className="no-drag"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: borderRadius * zoom,
        pointerEvents: 'none',
      }}
    >
      {src ? (
        <img
          src={src}
          alt="Imagen"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // o 'contain' si querés que no recorte
            borderRadius: 'inherit',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#e2e8f0',
            color: '#64748b',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 12 * zoom,
            fontStyle: 'italic',
          }}
        >
          Sin imagen
        </div>
      )}
    </div>
  );
};

export default ImagenComp;
