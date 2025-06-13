// src/db/utils.ts
import { db } from './indexedDb';
import type { CambioPendiente, ProyectoOffline } from './indexedDb';

export async function guardarCambioOffline(cambio: Omit<CambioPendiente, 'id' | 'timestamp'>) {
  try {
    await db.cambiosPendientes.add({
      ...cambio,
      timestamp: Date.now(),
    });
    console.log('📦 Cambio guardado offline:', cambio);
  } catch (err) {
    console.error('❌ Error guardando cambio offline:', err);
  }
}

export async function guardarProyectoOffline(proyecto: ProyectoOffline) {
  try {
    await db.proyectosOffline.put({
      ...proyecto,
      actualizadoEn: Date.now(),
    });
    console.log('🧩 Proyecto guardado offline:', proyecto);
  } catch (err) {
    console.error('❌ Error guardando proyecto offline:', err);
  }
}
