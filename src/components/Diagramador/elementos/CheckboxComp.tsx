import React from 'react';

type Props = {
  texto?: string;
  fontSize?: number;
  zoom: number;
};

const CheckboxComp: React.FC<Props> = ({
  texto = 'Opción',
  fontSize = 14,
  zoom,
}) => (
<label
  className="no-drag"
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: fontSize * zoom,
    cursor: "pointer",
    width: "100%",
    height: "100%",
    overflow: "hidden",        // ✅ clave
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  }}
>
  <input
    type="checkbox"
    style={{ transform: `scale(${zoom})`, flexShrink: 0 }}
  />
  <span style={{ overflow: "hidden", textOverflow: "ellipsis", flexGrow: 1 }}>
    {texto}
  </span>
</label>

);

export default CheckboxComp;
