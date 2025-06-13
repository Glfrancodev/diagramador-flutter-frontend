import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';

// ⬇️ IMPORTANTE: importar registro del SW
import { registerSW } from 'virtual:pwa-register';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ⬇️ REGISTRO DEL SERVICE WORKER
registerSW({
  onNeedRefresh() {
    console.log('Nueva versión disponible. Actualiza para obtener los últimos cambios.');
  },
  onOfflineReady() {
    console.log('La app ya está lista para funcionar sin conexión 🚀');
  },
});
