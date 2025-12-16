// src/app/productos/[id]/page.tsx

import ProductDetail from "./ProductDetail";

// Si tu Next es 15 y te da el aviso de que params es Promise, usa este tipo:
type PageProps = {
  params: Promise<{ id: string }>;
};

// Si no te da ese aviso y funciona normal, puedes cambiarlo por:
// type PageProps = { params: { id: string } };

async function getProducto(id: string) {
  // URL relativa para evitar problemas con NEXT_PUBLIC_BASE_URL
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/productos/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    // Aquí podrías lanzar notFound() si quieres
    throw new Error("No se pudo cargar el producto");
  }

  const data = await res.json();
  return data.producto;
}

export default async function ProductoPage(props: PageProps) {
  // Descomenta UNA de las dos líneas según tu versión de Next:

  // 1) Para Next 15 (params es Promise):
  const { id } = await props.params;

  // 2) Para versiones donde params NO es Promise:
  // const { id } = props.params;

  const producto = await getProducto(id);

  return <ProductDetail producto={producto} />;
}
