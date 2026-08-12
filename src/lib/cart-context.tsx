"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Product, ProductVariation } from "@/types";

export interface CartItem {
  id: string; // product.id + variation index
  product: Product;
  quantity: number;
  variationIndex: number;
  tranche: boolean;
  unitPrice: number;
}

interface CartContext {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  hydrated: boolean;
  setOpen: (v: boolean) => void;
  addItem: (product: Product, variationIndex?: number, tranche?: boolean) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
}

const CartCtx = createContext<CartContext | null>(null);

const STORAGE_KEY = "moulin-cart";

function buildId(productId: string, variationIndex: number) {
  return `${productId}-${variationIndex}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, variationIndex = 0, tranche = false) => {
    const variations: ProductVariation[] = Array.isArray(product.variations) ? product.variations : [];
    const modifier = variations[variationIndex]?.price_modifier ?? 0;
    const unitPrice = product.price + modifier;
    const id = buildId(product.id, variationIndex);

    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id, product, quantity: 1, variationIndex, tranche, unitPrice }];
    });
    setOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
    }
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <CartCtx.Provider value={{ items, count, total, open, hydrated, setOpen, addItem, removeItem, updateQty, clear }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
