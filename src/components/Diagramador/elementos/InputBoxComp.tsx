import React from "react";

type Props = {
  placeholder?: string;
  fontSize?: number;
  zoom: number;
};

const InputBoxComp: React.FC<Props> = ({
  placeholder = "Escribe algo...",
  fontSize = 14,
  zoom,
}) => (
  <input
    className="no-drag"
    placeholder={placeholder}
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

export default InputBoxComp;
