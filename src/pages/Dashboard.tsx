import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../services/axiosInstance";

import ProyectoCard from "../components/ProyectoCard";
import Button from "../components/Button";
import Modal from "../components/Modal";

import {
  ArrowRightOnRectangleIcon as LogoutIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  /* ---------- estados ---------- */
  const [perfil,            setPerfil]            = useState<any>(null);
  const [misProyectos,      setMisProyectos]      = useState<any[]>([]);
  const [compartidos,       setCompartidos]       = useState<any[]>([]);
  const [relaciones,        setRelaciones]        = useState<any[]>([]);

  const [showMis,           setShowMis]           = useState(true);
  const [showCompartidos,   setShowCompartidos]   = useState(true);

  // modales
  const [modalCrear,        setModalCrear]        = useState(false);
  const [modalEditar,       setModalEditar]       = useState(false);
  const [modalInv,          setModalInv]          = useState(false);
  const [modalFoto,         setModalFoto]         = useState(false);

  // crear/editar
  const [nuevoNombre,       setNuevoNombre]       = useState("");
  const [nuevaDesc,         setNuevaDesc]         = useState("");
  const [proyectoEditar,    setProyectoEditar]    = useState<any>(null);

  // importar foto
  const [foto,              setFoto]              = useState<File | null>(null);
  const [resultadoFoto,     setResultadoFoto]     = useState<any>(null);
  const [clavesFoto,        setClavesFoto]        = useState<Record<string,string>>({});

  // invitaciones
  const [invPendientes,     setInvPendientes]     = useState<any[]>([]);

  /* ---------- carga inicial ---------- */
  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const { data: perfilSrv }   = await axiosInstance.get("/usuarios/perfil");
      const { data: propios }     = await axiosInstance.get("/proyectos/mis-proyectos");
      const { data: comps }       = await axiosInstance.get("/proyectos/invitados");

      localStorage.setItem("nombre", perfilSrv.nombre || "");
      setPerfil(perfilSrv);
      setMisProyectos(propios);
      setCompartidos(comps);
    } catch {
      handleLogout();
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iaNombre, setIaNombre] = useState("");
  const [iaDescripcion, setIaDescripcion] = useState("");
  const [iaPrompt, setIaPrompt] = useState("");
  const [generando, setGenerando] = useState(false);

  /* ---------- helpers ---------- */
  const handleLogout = () => {
    localStorage.removeItem("correo");
    logout();
  };

  const irAlProyecto = (id: string | number) => {
    localStorage.setItem("idProyecto", id.toString());
    navigate(`/proyecto/${id}`);
  };

const generarConIA = async () => {
  if (!iaNombre.trim() || !iaPrompt.trim() || !iaDescripcion.trim()) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  try {
    setGenerando(true);
    const response = await axiosInstance.post(`/proyectos/generar-desde-prompt`, {
      titulo: iaNombre.trim(),
      descripcion: iaDescripcion.trim(),
      prompt: iaPrompt.trim(),
    });

    await cargarDatos(); // recarga sin redireccionar
  } catch (error: any) {
    console.error("Error generando proyecto IA", error);
    console.error("Respuesta del backend:", error.response?.data); // 🔥 Esta línea es clave
    alert("Error al generar proyecto con IA");
  } finally {
    setGenerando(false);
    setIsModalOpen(false);
  }
};

const generarDesdeImagen = async () => {
  if (!iaNombre.trim() || !iaDescripcion.trim() || !foto) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  try {
    setGenerando(true);
    const formData = new FormData();
    formData.append("imagen", foto);
    formData.append("nombre", iaNombre.trim());
    formData.append("descripcion", iaDescripcion.trim());

    const response = await axiosInstance.post("/proyectos/importar-boceto", formData);

    await cargarDatos(); // recarga proyectos
  } catch (error: any) {
    console.error("Error generando desde imagen", error);
    console.error("Respuesta del backend:", error.response?.data);
    alert("Error al generar proyecto desde imagen");
  } finally {
    setGenerando(false);
    setModalFoto(false);
    setFoto(null);
  }
};

  
  /* ---------- CRUD proyecto ---------- */
  const crearProyecto = async () => {
    if (!nuevoNombre.trim()) return alert("El nombre es obligatorio");
    await axiosInstance.post("/proyectos", { nombre: nuevoNombre, descripcion: nuevaDesc });
    setModalCrear(false);
    setNuevoNombre(""); setNuevaDesc("");
    cargarDatos();
  };

  const abrirEditar = (p: any) => {
    setProyectoEditar(p);
    setNuevoNombre(p.nombre);
    setNuevaDesc(p.descripcion || "");
    setModalEditar(true);
  };

  const guardarCambios = async () => {
    if (!nuevoNombre.trim()) return alert("El nombre es obligatorio");
    await axiosInstance.put(`/proyectos/${proyectoEditar.idProyecto}`, {
      nombre: nuevoNombre, descripcion: nuevaDesc,
    });
    setModalEditar(false);
    setProyectoEditar(null);
    cargarDatos();
  };

  const eliminarProyecto = async (p: any) => {
    if (!confirm("¿Eliminar proyecto definitivamente?")) return;
    await axiosInstance.delete(`/proyectos/${p.idProyecto}`);
    cargarDatos();
  };

  /* ---------- invitaciones ---------- */
  const cargarInvitaciones = async () => {
    const { data } = await axiosInstance.get("/invitaciones/pendientes");
    setInvPendientes(data);
  };
  const aceptarInv  = (id: any) => actualizarInv(id, "aceptada");
  const rechazarInv = (id: any) => actualizarInv(id, "rechazada");
  const actualizarInv = async (id: any, estado: string) => {
    await axiosInstance.put(`/invitaciones/${id}`, { estado });
    cargarDatos();
    cargarInvitaciones();
  };

  /* ---------- UI ---------- */
  const Section = ({
    title, show, toggle, children, extraBtn,
  }: {
    title: string; show: boolean; toggle: () => void; children: any; extraBtn?: any;
  }) => (
    <section className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl mb-12">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {extraBtn}
          <button
            onClick={toggle}
            className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
          >
            {show ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>
      {show && children}
    </section>
  );

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-indigo-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* NAVBAR */}
        <header className="flex justify-between items-center py-4 px-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg mb-10 sticky top-4 z-20">
          <div>
            <h1 className="text-2xl font-bold">Hola, {perfil?.nombre}</h1>
            <p className="text-sm text-gray-300">{perfil?.correo}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow transition"
          >
            <LogoutIcon className="w-5 h-5" /> Salir
          </button>
        </header>

        {/* MIS PROYECTOS */}
        <Section
          title="Mis proyectos"
          show={showMis}
          toggle={() => setShowMis(!showMis)}
          extraBtn={
            <div className="flex gap-2">
              {/* importar desde imagen */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow"
                title="Generar por prompt"
              >
                Prompt
              </button>
              <button
                onClick={() => setModalFoto(true)}
                className="p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow"
                title="Importar desde imagen"
              >
                IMG
              </button>
              {/* nuevo proyecto */}
              <button
                onClick={() => setModalCrear(true)}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow"
                title="Nuevo proyecto"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          }
        >
          {misProyectos.length === 0 ? (
            <p className="text-gray-300">No has creado proyectos todavía.</p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {misProyectos.map((p) => (
                <ProyectoCard
                  key={p.idProyecto}
                  proyecto={p}
                  onClick={() => irAlProyecto(p.idProyecto)}
                  mostrarAcciones
                  onEditar={() => abrirEditar(p)}
                  onEliminar={() => eliminarProyecto(p)}
                />
              ))}
            </div>
          )}
        </Section>

        {/* COMPARTIDOS */}
        <Section
          title="Proyectos compartidos contigo"
          show={showCompartidos}
          toggle={() => setShowCompartidos(!showCompartidos)}
          extraBtn={
            <button
              onClick={() => {
                cargarInvitaciones();
                setModalInv(true);
              }}
              className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full"
              title="Invitaciones pendientes"
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          }
        >
          {compartidos.length === 0 ? (
            <p className="text-gray-300">No tienes proyectos compartidos.</p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {compartidos.map((p) => (
                <ProyectoCard
                  key={p.idProyecto}
                  proyecto={p}
                  onClick={() => irAlProyecto(p.idProyecto)}
                />
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* --------- MODALES --------- */}

      {/* Crear proyecto */}
      {modalCrear && (
        <Modal title="Nuevo proyecto" onClose={() => setModalCrear(false)}>
          <input
            className="w-full mb-4 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder="Nombre"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <textarea
            className="w-full mb-4 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder="Descripción"
            value={nuevaDesc}
            onChange={(e) => setNuevaDesc(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button outline onClick={() => setModalCrear(false)}>Cancelar</Button>
            <Button onClick={crearProyecto}>Crear</Button>
          </div>
        </Modal>
      )}
{isModalOpen && (
  <Modal title="Generar proyecto con IA" onClose={() => !generando && setIsModalOpen(false)}>
    <div className="space-y-4 opacity-100 relative">
      <input
        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        placeholder="Título del proyecto"
        value={iaNombre}
        onChange={(e) => setIaNombre(e.target.value)}
        disabled={generando}
      />
      <textarea
        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        placeholder="Descripción"
        value={iaDescripcion}
        onChange={(e) => setIaDescripcion(e.target.value)}
        disabled={generando}
      />
      <textarea
        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        placeholder="Prompt"
        rows={4}
        value={iaPrompt}
        onChange={(e) => setIaPrompt(e.target.value)}
        disabled={generando}
      />

      <div className="flex justify-end gap-3 flex-wrap">
        <Button
          outline
          onClick={() => setIsModalOpen(false)}
          disabled={generando}
        >
          Cancelar
        </Button>
        <Button
          onClick={generarConIA}
          disabled={generando || !iaNombre.trim() || !iaPrompt.trim()}
        >
          {generando ? "Generando..." : "Generar"}
        </Button>
      </div>

{generando && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="flex flex-col items-center justify-center gap-6">
      <svg
        className="animate-spin h-16 w-16 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 30 30"
      >
        <circle
          className="opacity-25"
          cx="15"
          cy="15"
          r="12"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 15a11 11 0 0111-11v11H4z"
        ></path>
      </svg>
      <p className="text-white text-lg font-semibold tracking-wide">
        Generando...
      </p>
    </div>
  </div>
)}


    </div>
  </Modal>
)}


      {/* Editar proyecto */}
      {modalEditar && (
        <Modal title="Editar proyecto" onClose={() => setModalEditar(false)}>
          <input
            className="w-full mb-4 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder="Nombre"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <textarea
            className="w-full mb-4 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            placeholder="Descripción"
            value={nuevaDesc}
            onChange={(e) => setNuevaDesc(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button outline onClick={() => setModalEditar(false)}>Cancelar</Button>
            <Button onClick={guardarCambios}>Guardar</Button>
          </div>
        </Modal>
      )}

      {/* Importar imagen */}
      {modalFoto && (
  <Modal title="Importar desde imagen" onClose={() => !generando && setModalFoto(false)}>
    <div className="space-y-4 opacity-100 relative">
      <input
        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        placeholder="Título del proyecto"
        value={iaNombre}
        onChange={(e) => setIaNombre(e.target.value)}
        disabled={generando}
      />
      <textarea
        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        placeholder="Descripción"
        value={iaDescripcion}
        onChange={(e) => setIaDescripcion(e.target.value)}
        disabled={generando}
      />
      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => setFoto(e.target.files?.[0] || null)}
        className="w-full"
        disabled={generando}
      />

      <div className="flex justify-end gap-3 flex-wrap">
        <Button
          outline
          onClick={() => setModalFoto(false)}
          disabled={generando}
        >
          Cancelar
        </Button>
        <Button
          onClick={generarDesdeImagen}
          disabled={generando || !iaNombre.trim() || !iaDescripcion.trim() || !foto}
        >
          {generando ? "Generando..." : "Generar"}
        </Button>
      </div>

      {generando && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center justify-center gap-6">
            <svg
              className="animate-spin h-16 w-16 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 30 30"
            >
              <circle
                className="opacity-25"
                cx="15"
                cy="15"
                r="12"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 15a11 11 0 0111-11v11H4z"
              ></path>
            </svg>
            <p className="text-white text-lg font-semibold tracking-wide">
              Generando...
            </p>
          </div>
        </div>
      )}
    </div>
  </Modal>
)}


      {/* Invitaciones */}
      {modalInv && (
        <Modal title="Invitaciones pendientes" onClose={() => setModalInv(false)}>
          {invPendientes.length === 0 ? (
            <p className="text-gray-300 text-center">No tienes invitaciones pendientes.</p>
          ) : (
            <div className="space-y-4">
              {invPendientes.map((inv) => (
                <div
                  key={inv.idInvitacion}
                  className="border border-white/20 rounded-lg p-4 flex flex-col gap-2"
                >
                  <header className="font-semibold">{inv.nombreProyecto}</header>
                  <p className="text-sm text-gray-300">{inv.descripcionProyecto}</p>
                  <p className="text-xs text-gray-400">Propietario: {inv.correoDueno}</p>
                  <div className="flex gap-2">
                    <Button className="bg-green-500 hover:bg-green-600" onClick={() => aceptarInv(inv.idInvitacion)}>Aceptar</Button>
                    <Button className="bg-red-500 hover:bg-red-600"   onClick={() => rechazarInv(inv.idInvitacion)}>Rechazar</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
