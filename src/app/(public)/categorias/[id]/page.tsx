// src/app/categorias/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import clienteAxios from "@/lib/axiosClient";

export default function CategoryPage() {
  const params = useParams();
  const id = params?.id as string;

  const [productosCategoria, setProductosCategoria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaNombre, setCategoriaNombre] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);

        // 1) Productos por categoría
        const res = await clienteAxios.get(`/productos?categoria=${id}`);
        const data: any = res.data; // Ya corregido
        
        if (data.ok) {
          setProductosCategoria(data.productos || []);
        } else {
          setProductosCategoria([]);
        }

        // 2) Categorías para sacar el nombre de la actual
        const resCats = await clienteAxios.get("/categorias");
        
        // --- AQUÍ ESTABA EL ERROR NUEVO ---
        // Creamos una variable 'dataCats' de tipo any para que TS no se queje
        const dataCats: any = resCats.data; 

        if (dataCats?.ok) {
          const cats = dataCats.categorias || [];
          const catActual = cats.find((c: any) => c._id === id);
          setCategoriaNombre(catActual?.nombre || "");
        }
        // ----------------------------------

      } catch (error) {
        console.error("Error cargando datos de categoría:", error);
        setProductosCategoria([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  return (
    <main className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">
        Productos categoría{" "}
        <span className="text-accent">
          {categoriaNombre || "Sin nombre"}
        </span>
      </h1>

      {loading ? (
        <p>Cargando productos...</p>
      ) : productosCategoria.length > 0 ? (
        <ProductGrid
          productosFiltrados={productosCategoria}
          busquedaActiva={true}
          productosDestacados={[]}
        />
      ) : (
        <p>Resultados de la búsqueda, no hay productos que mostrar.</p>
      )}
    </main>
  );
}
