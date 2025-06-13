// src/db/indexedDb.ts
import Dexie from 'dexie';
import type { Table } from 'dexie';


export interface CambioPendiente {
  id?: number;
  proyectoId: string;
  timestamp: number;
  tipo: 'actualizacion' | 'nuevo' | 'borrado';
  elementoId: string;
  datos: any;
}

export interface ProyectoOffline {
  id: string;
  nombre: string;
  contenido: any;
  actualizadoEn: number;
}



class AppDB extends Dexie {
  cambiosPendientes!: Table<CambioPendiente, number>;
  proyectosOffline!: Table<ProyectoOffline, string>;

  constructor() {
    super('ProyectoOfflineDB');
    this.version(1).stores({
      cambiosPendientes: '++id, proyectoId, timestamp',
      proyectosOffline: 'id',
    });
  }
}

export const db = new AppDB();
