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

  /* ---------- helpers ---------- */
  const handleLogout = () => {
    localStorage.removeItem("correo");
    logout();
  };

  const irAlProyecto = (id: string | number) => {
    localStorage.setItem("idProyecto", id.toString());
    navigate(`/proyecto/${id}`);
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
        <Modal title="Importar imagen de boceto" onClose={() => setModalFoto(false)}>
          {!resultadoFoto ? (
            <>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => setFoto(e.target.files?.[0] || null)}
                className="w-full mb-4"
              />
              <Button
                onClick={async () => {
                  if (!foto) return alert("Selecciona una imagen PNG o JPG");
                  const formData = new FormData();
                  formData.append("imagen", foto);
                  try {
                    const { data } = await axiosInstance.post("/proyectos/importar-boceto", formData);
                    setResultadoFoto(data.estructura);
                    const inicial: Record<string,string> = {};
                    data.estructura.clases.forEach((c: any) => {
                      const primerAttr = c.atributos?.[0]?.nombre || "";
                      if (primerAttr) inicial[c.nombre] = primerAttr;
                    });
                    setClavesFoto(inicial);
                    setRelaciones(data.estructura.relaciones || []);
                  } catch {
                    alert("Error al analizar imagen");
                  }
                }}
              >
                Analizar foto
              </Button>
            </>
          ) : (
            <>
              <p className="font-semibold mb-2">Selecciona la clave primaria de cada clase:</p>
              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                {resultadoFoto.clases.map((clase: any) => (
                  <div key={clase.nombre}>
                    <label className="font-medium">{clase.nombre}</label>
                    <select
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                      value={clavesFoto[clase.nombre]}
                      onChange={(e) =>
                        setClavesFoto({ ...clavesFoto, [clase.nombre]: e.target.value })
                      }
                    >
                      {clase.atributos.map((attr: any) => (
                        <option key={attr.nombre} value={attr.nombre}>{attr.nombre}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 flex-wrap">
                <Button outline onClick={() => setModalFoto(false)}>Cancelar</Button>
                <Button
                  onClick={async () => {
                    try {
                      const resp = await axiosInstance.post(
                        "/proyectos/exportar-crud-simulado",
                        {
                          clases: resultadoFoto.clases,
                          llavesPrimarias: clavesFoto,
                          relaciones,
                        },
                        { responseType: "blob" }
                      );
                      const blob = new Blob([resp.data], { type: "application/zip" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "proyectoAngular.zip";
                      a.click();
                      URL.revokeObjectURL(url);
                      // limpia
                      setModalFoto(false);
                      setResultadoFoto(null);
                      setFoto(null);
                      setClavesFoto({});
                      setRelaciones([]);
                    } catch {
                      alert("Error al exportar proyecto");
                    }
                  }}
                >
                  Exportar proyecto Angular
                </Button>
              </div>
            </>
          )}
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
