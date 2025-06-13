// src/hooks/useOnlineStatus.ts
import { useEffect, useState } from 'react';

export default function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

useEffect(() => {
  console.log("🧪 Hook cargado. Estado inicial:", navigator.onLine);
  const update = () => {
    console.log("📡 Evento detectado. Ahora:", navigator.onLine);
    setOnline(navigator.onLine);
  };
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  return () => {
    window.removeEventListener("online", update);
    window.removeEventListener("offline", update);
  };
}, []);


  return online;
}
