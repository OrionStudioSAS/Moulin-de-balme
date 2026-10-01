import { useEffect, useState } from "react";

/** Les modales et panneaux sont rendus dans la racine de l'admin pour garder polices, langue et variables */
export function portalRoot(): HTMLElement {
  return document.getElementById("bo-root") ?? document.body;
}

/** Faux au rendu serveur et à l'hydratation : évite d'appeler createPortal sans DOM */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
