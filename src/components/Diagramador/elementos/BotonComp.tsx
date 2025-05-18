import React from "react";

type Props = {
  texto?: string;
  color?: string;
  fontSize?: number;
  zoom: number;
};

const BotonComp: React.FC<Props> = ({
  texto = "Botón",
  color = "#007bff",
  fontSize = 14,
  zoom,
}) => (
<button
  className="no-drag"
  style={{
    width: "100%",
    height: "100%",
    border: "none",
    borderRadius: 4,
    background: color,
    color: "#fff",
    fontSize: fontSize * zoom,
    cursor: "pointer",
    overflow: "hidden",        // ✅ clave
    whiteSpace: "nowrap",      // ✅ evita saltos de línea
    textOverflow: "ellipsis",  // ✅ muestra "..." si se desborda
  }}
>
  {texto}
</button>

);

export default BotonComp;
