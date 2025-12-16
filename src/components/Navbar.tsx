"use client";

import React from "react";
import Link from "next/link";

type Categoria = {
  _id: string;
  nombre: string;
};

type NavbarProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  categories: any[];
  onSearch?: (text: string) => void;
  searchQuery?: string;
};

export default function Navbar({
  darkMode,
  setDarkMode,
  categories = [],
  onSearch,
  searchQuery = "",
}: NavbarProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSearch?.(e.target.value);
  }

  return (
    <nav className="flex justify-between items-center bg-secondary text-neutral px-8 py-2 font-poppins dark:bg-darkNavBg dark:text-darkNavText transition-colors duration-300">
      <div className="flex space-x-6 overflow-x-auto">
        <Link href="/" className="hover:text-primary">
          Inicio
        </Link>
        {categories.map((cat: Categoria) => (
          <Link
            key={cat._id}
            href={`/categorias/${cat._id}`}
            className="hover:text-primary whitespace-nowrap"
          >
            {cat.nombre}
          </Link>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={handleChange}
          className="px-3 py-1 rounded-md text-black"
        />

        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle Dark Mode"
          className="bg-primary text-neutral rounded-full p-2 hover:bg-primaryHover transition-colors duration-300"
        >
          {darkMode ? "🌞" : "🌙"}
        </button>

        <button className="bg-primary text-neutral px-4 py-2 rounded-base" disabled>
          Iniciar sesión
        </button>
      </div>
    </nav>
  );
}
