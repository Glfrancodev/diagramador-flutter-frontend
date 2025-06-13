import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import ReactMarkdown from "react-markdown";

export default function ChatBotFlotante({
  onClose,
  proyectoId,
  tabNombre,
}: {
  onClose: () => void;
  proyectoId: string;
  tabNombre: string;
}) {
  const [mensajes, setMensajes] = useState<{ emisor: "usuario" | "bot"; texto: string }[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;
    const nuevoMensaje = { emisor: "usuario" as const, texto: mensaje.trim() };
    setMensajes((prev) => [...prev, nuevoMensaje]);
    setMensaje("");
    setCargando(true);

    try {
      const { data } = await axiosInstance.post(`/proyectos/${proyectoId}/duda-bot`, {
        pregunta: nuevoMensaje.texto,
      });

      setMensajes((prev) => [...prev, { emisor: "bot", texto: data.respuesta }]);
    } catch (e) {
      console.error("Error al enviar mensaje al bot", e);
      setMensajes((prev) => [
        ...prev,
        { emisor: "bot", texto: "❌ Ocurrió un error al procesar tu mensaje." },
      ]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, cargando]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 320,
        height: 400,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Encabezado */}
      <div
        style={{
          background: "#1f2937",
          color: "white",
          padding: "8px 12px",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Asistente</strong>
        <button
          onClick={onClose}
          style={{ background: "none", color: "white", border: "none", cursor: "pointer" }}
        >
          ✕
        </button>
      </div>

      {/* Mensajes */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {mensajes.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.emisor === "usuario" ? "flex-end" : "flex-start",
              background: msg.emisor === "usuario" ? "#3b82f6" : "#e5e7eb",
              color: msg.emisor === "usuario" ? "white" : "black",
              padding: "8px 12px",
              borderRadius: 12,
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              fontSize: 14,
            }}
          >
            {msg.emisor === "bot" ? (
<ReactMarkdown
  components={{
    p: ({ children }) => (
      <p style={{ margin: 0, lineHeight: "1.1" }}>{children}</p>
    ),
    ul: ({ children }) => (
      <ul style={{ margin: "2px 0 2px 14px", padding: 0, lineHeight: "1.1" }}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol style={{ margin: "2px 0 2px 14px", padding: 0, lineHeight: "1.1" }}>{children}</ol>
    ),
    li: ({ children }) => (
      <li style={{ marginBottom: 1 }}>{children}</li>
    ),
    strong: ({ children }) => (
      <strong style={{ fontWeight: 600 }}>{children}</strong>
    ),
  }}
>
  {msg.texto}
</ReactMarkdown>



            ) : (
              msg.texto
            )}
          </div>
        ))}

        {cargando && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#e5e7eb",
              padding: "8px 12px",
              borderRadius: 12,
            }}
          >
            <span style={{ display: "inline-block", animation: "blink 1s infinite" }}>...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
        <input
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          placeholder="Escribe tu duda…"
          style={{ flex: 1, padding: 10, border: "none", outline: "none" }}
        />
        <button
          onClick={enviarMensaje}
          style={{
            padding: "10px 14px",
            background: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </div>

      {/* Animación para los 3 puntitos */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 0.2; }
            50% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
    </div>
  );
}
