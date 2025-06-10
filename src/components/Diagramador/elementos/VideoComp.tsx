import React from 'react';

type Props = {
  idArchivo?: string;
  zoom: number;
  borderRadius?: number;
  modoCine?: boolean; // ✅ nuevo prop
};

const VideoComp: React.FC<Props> = ({
  idArchivo,
  zoom,
  borderRadius = 0,
  modoCine = false, // ✅ valor por defecto
}) => {
  const src = idArchivo
  ? `${import.meta.env.VITE_API_URL}/archivos/${idArchivo}/descargar`
    : null;

  return (
    <div
      className="no-drag"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: borderRadius * zoom,
        pointerEvents: modoCine ? 'auto' : 'none', // ✅ ahora sí responde al modo cine
      }}
    >
      {src ? (
        <video
          controls
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
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
          Sin video
        </div>
      )}
    </div>
  );
};

export default VideoComp;
