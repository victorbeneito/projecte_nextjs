"use client";

import React, { useState, useEffect } from "react";
import Banner from "@/components/Banner";
import ProductGrid from "@/components/ProductGrid";
import BannersSection from "@/components/BannersSection";
import BannerPrincipal from "@/components/BannerPrincipal";
import SeoText from "@/components/SeoText";
import SubscribeForm from "@/components/SubscribeForm";
import clienteAxios from "@/lib/axiosClient";

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [productosDestacados, setProductosDestacados] = useState<any[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<any[]>([]);
  const [busquedaActiva, setBusquedaActiva] = useState(false);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const { data } = await clienteAxios.get("/categorias");
        if (data.ok) setCategories(data.categorias || []);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    cargarCategorias();
  }, []);

  useEffect(() => {
    const buscarProductos = async () => {
      try {
        if (!searchQuery.trim()) {
          const { data } = await clienteAxios.get("/productos");
          if (data.ok) {
            setProductosDestacados(data.productos);
            setProductosFiltrados([]);
            setBusquedaActiva(false);
          }
        } else {
          const { data } = await clienteAxios.get(
            `/productos?q=${encodeURIComponent(searchQuery)}`
          );
          if (data.ok) {
            setProductosFiltrados(data.productos);
            setBusquedaActiva(true);
          }
        }
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };

    buscarProductos();
  }, [searchQuery]);

  // si quieres, luego conecta handleSearch con Navbar mediante contexto o props elevadas
  // por ahora, podrías leer searchQuery desde AppShell en vez de aquí.

  return (
  <div className="w-full">
    {/* 1. Banner (más ancho) */}
    <section className="max-w-7xl mx-auto">
      <Banner />
    </section>

    {/* 2. BannerPrincipal (más ancho) */}
    <section className="max-w-7xl mx-auto">
      <BannerPrincipal categories={categories} />
    </section>

    {/* 3. Productos Destacados (ancho cómodo) */}
    <section className="max-w-7xl mx-auto">
      <ProductGrid
        productosDestacados={productosDestacados}
        productosFiltrados={productosFiltrados}
        busquedaActiva={busquedaActiva}
      />
    </section>

    {/* 4. BannersSection (más ancho) */}
    <section className="max-w-7xl mx-auto">
      <BannersSection categories={categories} />
    </section>

    {/* 5. Seo + Newsletter (ancho cómodo) */}
    <section className="max-w-6xl mx-auto">
      <SeoText />
      <SubscribeForm />
    </section>
  </div>
);


  // return (
  //   <>
  //     <Banner />
  //     <BannerPrincipal categories={categories} />
  //     <ProductGrid
  //       productosDestacados={productosDestacados}
  //       productosFiltrados={productosFiltrados}
  //       busquedaActiva={busquedaActiva}
  //     />
  //     <BannersSection categories={categories} />
  //     <SeoText />
  //     <SubscribeForm />
  //   </>
  // );
}
