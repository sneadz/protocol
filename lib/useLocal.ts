"use client";
import { useEffect, useState } from "react";

/**
 * useState persisté en localStorage. Rend `initial` au premier render (serveur
 * et client) puis rattrape la valeur stockée dans un effet : pas de mismatch
 * d'hydratation. Le 3e élément dit si la lecture est faite.
 */
export function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // stockage corrompu ou bloqué (Safari privé) : on garde `initial`
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return; // sinon on écraserait le stockage avant de l'avoir lu
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, loaded, value]);

  return [value, setValue, loaded] as const;
}
