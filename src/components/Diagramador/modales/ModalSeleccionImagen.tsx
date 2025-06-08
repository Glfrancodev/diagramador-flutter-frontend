// src/components/Diagramador/ModalSeleccionImagen.tsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../../services/axiosInstance';

export type Archivo = {
  idArchivo: string;
  nombre: string;
  tipo: string;
};

type Props = {
  proyectoId: string;
  onClose: () => void;
  onSelect: (archivo: Archivo) => void;
};

export default function ModalSeleccionImagen({ proyectoId, onClose, onSelect }: Props) {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArchivos = async () => {
      try {
        const { data } = await axiosInstance.get(`/archivos/${proyectoId}?tipo=imagen`);
        setArchivos(data);
        setError(null);
      } catch (err: any) {
        console.error("Error al obtener archivos:", err);
        setError("Error al obtener archivos. Asegúrate de estar autenticado.");
      } finally {
        setCargando(false);
      }
    };
    fetchArchivos();
  }, [proyectoId]);

  const handleSubir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('archivo', file); // <- este es el nombre correcto esperado por multer
      formData.append('tipo', 'imagen');
      formData.append('idProyecto', proyectoId);

      await axiosInstance.post('/archivos', formData);
      const { data } = await axiosInstance.get(`/archivos/${proyectoId}`);
      setArchivos(data);
    } catch (err) {
      console.error('Error al subir archivo:', err);
      alert('No se pudo subir el archivo');
    }
  };

  const handleEliminar = async (idArchivo: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;

    try {
      await axiosInstance.delete(`/archivos/${idArchivo}`);
      setArchivos((prev) => prev.filter((a) => a.idArchivo !== idArchivo));
    } catch (err) {
      console.error('Error al eliminar archivo:', err);
      alert('No se pudo eliminar el archivo');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.6)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ background: '#fff', padding: 20, maxWidth: 600, width: '90%', borderRadius: 8 }}>
        <h3>Seleccionar imagen</h3>

        {cargando && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 12 }}>
          {archivos.length === 0 && !cargando && (
            <p style={{ color: '#555', fontStyle: 'italic' }}>No hay archivos en el proyecto</p>
          )}

          {archivos.map((archivo) => (
            <div
              key={archivo.idArchivo}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid #ddd',
              }}
            >
              <div style={{ flex: 1 }}>
                <strong>{archivo.nombre}</strong>
                <div style={{ fontSize: 12 }}>{archivo.tipo}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    onSelect(archivo); // <- solo se manda el idArchivo, nombre y tipo
                    onClose();
                  }}
                  style={{
                    padding: '4px 12px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                  }}
                >
                  Usar
                </button>
                <button
                  onClick={() => handleEliminar(archivo.idArchivo, archivo.nombre)}
                  style={{
                    padding: '4px 8px',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                  }}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onClose} style={{ padding: '6px 12px' }}>
            Cancelar
          </button>

          <label
            style={{
              padding: '6px 12px',
              background: '#10b981',
              color: '#fff',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Subir nueva imagen
            <input
              type="file"
              accept="image/*"
              onChange={handleSubir}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
