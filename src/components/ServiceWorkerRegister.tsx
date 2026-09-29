"use client";

import { useEffect } from "react";

// Подключает service worker (public/sw.js), нужный для установки PWA.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
  }, []);
  return null;
}
