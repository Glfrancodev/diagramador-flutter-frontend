type Props = {
  proyecto: {
    idProyecto: string | number;
    nombre: string;
    descripcion?: string;
    fechaCreacion: string;
  };
  onClick?: () => void;
  mostrarAcciones?: boolean;
  onEditar?: () => void;
  onEliminar?: () => void;
};

export default function ProyectoCard({
  proyecto,
  onClick,
  mostrarAcciones = false,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white/10 border border-white/20 p-5 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.02] transition cursor-pointer overflow-hidden"
    >
      {/* resplandor en hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-white transition" />
      <h3 className="text-lg font-semibold text-white mb-1">{proyecto.nombre}</h3>

      {proyecto.descripcion && (
        <p className="text-sm text-gray-300 mb-1 line-clamp-2">
          {proyecto.descripcion}
        </p>
      )}

      <p className="text-xs text-gray-400">
        {new Date(proyecto.fechaCreacion).toLocaleDateString()}
      </p>

      {mostrarAcciones && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition"
        >
          <button onClick={onEditar} className="text-yellow-400 hover:text-yellow-300">
            ✏️
          </button>
          <button onClick={onEliminar} className="text-red-400 hover:text-red-300">
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
