// /src/lib/cartService.ts
"use client";

/**
 * Servicio del carrito basado en localStorage.
 * Permite manejar los productos en el carrito sin backend.
 */

export interface CartItem {
  _id: string;
  id?: string; 
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  tamanoSeleccionado?: string | null;
  tiradorSeleccionado?: string | null;
  colorSeleccionado?: string | null;
  precioFinal?: number;
}

const CART_KEY = "carrito_tienda";

/** Obtiene el carrito actual */
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? (JSON.parse(data) as CartItem[]) : [];
  } catch (err) {
    console.error("Error al leer el carrito:", err);
    return [];
  }
}

/** Guarda el carrito internamente (sin evento) */
function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

/** ✅ Nuevo: Guarda el carrito y emite evento global (para renderizado en tiempo real) */
export function setCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // 🔔 Dispara un evento para que otros componentes reactiven su estado
  window.dispatchEvent(new Event("storage"));
}

/** Añadir un producto al carrito */
export async function addToCart(product: Partial<CartItem>) {
  if (typeof window === "undefined") return;

  const currentCart = getCart();

  // Buscamos si ya existe un producto idéntico (mismo id y variantes)
  const existingIndex = currentCart.findIndex(
    (item) =>
      item._id === product._id &&
      item.tamanoSeleccionado === product.tamanoSeleccionado &&
      item.tiradorSeleccionado === product.tiradorSeleccionado &&
      item.colorSeleccionado === product.colorSeleccionado
  );

  if (existingIndex >= 0) {
    // Si ya existe, sumamos la cantidad
    currentCart[existingIndex].cantidad += product.cantidad || 1;
  } else {
    // Si no existe, lo añadimos
    currentCart.push({
      _id: product._id!,
      nombre: product.nombre || "Producto sin nombre",
      precio: product.precio!,
      cantidad: product.cantidad || 1,
      imagen: product.imagen,
      tamanoSeleccionado: product.tamanoSeleccionado ?? null,
      tiradorSeleccionado: product.tiradorSeleccionado ?? null,
      colorSeleccionado: product.colorSeleccionado ?? null,
      precioFinal: product.precioFinal ?? product.precio!,
    });
  }

  setCart(currentCart);
}

/** Eliminar producto del carrito */
export function removeFromCart(productId: string) {
  const currentCart = getCart().filter((item) => item._id !== productId);
  setCart(currentCart);
}

/** Vaciar carrito */
export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("storage"));
}


