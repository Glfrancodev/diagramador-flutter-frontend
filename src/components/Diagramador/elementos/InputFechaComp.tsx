import React from "react";

type Props = {
  fontSize?: number;
  zoom: number;
};

const InputFechaComp: React.FC<Props> = ({
  fontSize = 14,
  zoom,
}) => (
  <input
    type="date"
    className="no-drag"
    style={{
      width: "100%",
      height: "100%",
      fontSize: fontSize * zoom,
      padding: "4px 8px",
      border: "1px solid #ccc",
      borderRadius: 4,
      outline: "none",
      color: "#333",
    }}
  />
);

export default InputFechaComp;
