import React from 'react';

type Props = {
  texto?: string;
  url?: string; // se guarda pero no se usa aquí
  fontSize?: number;
  color?: string;
  zoom: number;
};

const LinkComp: React.FC<Props> = ({
  texto = 'Enlace',
  fontSize = 14,
  color = '#2563eb',
  zoom,
}) => (
  <div
    className="no-drag"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
      fontSize: fontSize * zoom,
      color,
      textDecoration: 'underline',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      cursor: 'default',
      pointerEvents: 'none', // <- 🔒 esto evita interacción
    }}
  >
    {texto}
  </div>
);

export default LinkComp;
