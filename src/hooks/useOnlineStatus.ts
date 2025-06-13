import { useEffect, useState } from 'react';

export default function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateStatus = () => setOnline(navigator.onLine);

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Verificación activa cada 10s
    const interval = setInterval(async () => {
      try {
        // Hacé ping a tu backend (o cualquier URL que responda rápido)
        await fetch('/ping', { method: 'GET', cache: 'no-store' });
        setOnline(true);
      } catch {
        setOnline(false);
      }
    }, 10000); // cada 10s

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      clearInterval(interval);
    };
  }, []);

  return online;
}
