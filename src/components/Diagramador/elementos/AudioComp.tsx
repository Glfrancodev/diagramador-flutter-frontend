// src/components/Diagramador/componentes/AudioComp.tsx
import React, { useRef, useEffect } from 'react';

type Props = {
  idArchivo?: string;
  zoom: number;
  borderRadius?: number;
  modoPodcast?: boolean;
};

const AudioComp: React.FC<Props> = ({
  idArchivo,
  zoom,
  borderRadius = 0,
  modoPodcast = false,
}) => {
  const src = idArchivo
    ? `${import.meta.env.VITE_API_URL}/archivos/${idArchivo}/descargar`
    : null;

  const ref = useRef<HTMLAudioElement | null>(null);

  // Detener el audio si el modo podcast se desactiva
  useEffect(() => {
    if (!modoPodcast && ref.current) {
      ref.current.pause();
    }
  }, [modoPodcast]);

  return (
    <div
      className="no-drag"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: borderRadius * zoom,
        overflow: 'hidden',
        background: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: modoPodcast ? 'auto' : 'none', // 🔒 solo si está activado
        opacity: modoPodcast ? 1 : 0.5,                // 👁️ se muestra igual, pero desactivado
      }}
    >
      {src ? (
        <audio
          ref={ref}
          controls
          src={src}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      ) : (
        <div
          style={{
            fontSize: 12 * zoom,
            fontStyle: 'italic',
            color: '#64748b',
          }}
        >
          Sin audio
        </div>
      )}
    </div>
  );
};

export default AudioComp;
