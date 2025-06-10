import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, password }),
      });

      if (!res.ok) throw new Error("Registro fallido");

      alert("Usuario registrado correctamente");
      navigate("/");
    } catch (error) {
      alert("Error al registrar usuario");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-950 to-sky-400 overflow-hidden">
      {/* SVG decorativo */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.9"
            d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl w-full px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Panel de bienvenida */}
        <div className="text-white max-w-md hidden lg:block">
          <h1 className="text-4xl font-bold mb-4">Bienvenido</h1>
          <p className="text-sm opacity-80">
            Esta es una plataforma visual para diseñar interfaces móviles de manera rápida y sencilla, sin necesidad de programar. Arrastra y suelta componentes, organiza tus pantallas y exporta el resultado como un proyecto Flutter listo para usar. Ideal para prototipos, MVPs y apps en producción.
          </p>
        </div>

        {/* Tarjeta de registro */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Registro
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Correo"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-sky-800 hover:bg-sky-700 text-white py-3 rounded-lg font-semibold transition duration-300"
            >
              Registrarse
            </button>

            <p className="text-sm text-center text-gray-500">
              ¿Ya tienes cuenta?{" "}
              <Link to="/" className="text-sky-700 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
