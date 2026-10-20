"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { setExtraProducts, type Product } from "@/lib/catalog";

type Ctx = { extras: Product[]; loaded: boolean };
const ExtrasContext = createContext<Ctx>({ extras: [], loaded: false });

function valid(p: unknown): p is Product {
  const o = p as Partial<Product> | null;
  return Boolean(o && typeof o.slug === "string" && typeof o.name === "string" && typeof o.category === "string" && Array.isArray(o.images) && o.images.length > 0);
}

/** Loads the products added from the admin (hosting API) once per page load. Silent when the API does not exist (local dev, static hosts). */
export function ExtrasProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Ctx>({ extras: [], loaded: false });
  useEffect(() => {
    let alive = true;
    fetch("/api/catalog.php", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: unknown) => {
        const list = (Array.isArray(data) ? data : []).filter(valid).map((p) => ({ ...p, extra: true }));
        setExtraProducts(list);
        if (alive) setState({ extras: list, loaded: true });
      })
      .catch(() => alive && setState({ extras: [], loaded: true }));
    return () => {
      alive = false;
    };
  }, []);
  const value = useMemo(() => state, [state]);
  return <ExtrasContext.Provider value={value}>{children}</ExtrasContext.Provider>;
}

export function useExtras(): Ctx {
  return useContext(ExtrasContext);
}
