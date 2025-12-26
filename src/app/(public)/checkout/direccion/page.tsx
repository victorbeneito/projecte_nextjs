"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClienteAuth } from "@/context/ClienteAuthContext";
import { getCart } from "@/lib/cartService";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import toast from "react-hot-toast";

export default function DireccionPage() {
  const router = useRouter();
  const { cliente, token, loading, setCliente } = useClienteAuth();

  const [direccion, setDireccion] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    cp: "",
  });

  useEffect(() => {
    if (!loading) {
      const cart = getCart();
      if (cart.length === 0) {
        router.push("/carrito");
        return;
      }

      if (!cliente) {
        toast.error("Debes iniciar sesión antes de continuar.");
        router.push("/auth?redirect=/checkout/direccion");
        return;
      }

      // Precargar datos existentes del cliente si los tiene
      setDireccion({
        nombre: cliente?.nombre || "",
        email: cliente?.email || "",
        telefono: cliente?.telefono || "",
        direccion: cliente?.direccion || "",
        ciudad: cliente?.ciudad || "",
        cp: cliente?.cp || "",
      });

      // Priorizar datos guardados de sesión (si vuelve atrás)
      const previo = localStorage.getItem("checkout_direccion");
      if (previo) {
        setDireccion(JSON.parse(previo));
      }
    }
  }, [cliente, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDireccion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const camposObligatorios = [
      "nombre",
      "email",
      "telefono",
      "direccion",
      "ciudad",
      "cp",
    ];

    for (const campo of camposObligatorios) {
      if (!direccion[campo as keyof typeof direccion]) {
        toast.error("Completa todos los campos obligatorios.");
        return;
      }
    }

    try {
      // ✅ Guardar en la base de datos del cliente
      const res = await fetchWithAuth(`/api/clientes/${cliente.id}`, token, {
        method: "PUT",
        body: JSON.stringify(direccion),
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }

      // Actualiza el contexto local para futuras páginas
      setCliente({ ...cliente, ...direccion });

      // Guarda también en localStorage por comodidad
      localStorage.setItem("checkout_direccion", JSON.stringify(direccion));

      toast.success("Dirección guardada correctamente ✅");
      router.push("/checkout/envio");
    } catch (error) {
      console.error("❌ Error al guardar dirección:", error);
      toast.error("No se pudo guardar la dirección.");
    }
  };

  if (loading) return <p>Cargando...</p>;

  if (!cliente) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Necesitas iniciar sesión para continuar
        </h1>
        <button
          onClick={() => router.push("/auth?redirect=/checkout/direccion")}
          className="bg-primary text-white px-6 py-2 rounded font-semibold"
        >
          Iniciar sesión →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Dirección de envío 🏠</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={direccion.nombre}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={direccion.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teléfono *</label>
          <input
            type="tel"
            name="telefono"
            value={direccion.telefono}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dirección *</label>
          <input
            type="text"
            name="direccion"
            value={direccion.direccion}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad *</label>
            <input
              type="text"
              name="ciudad"
              value={direccion.ciudad}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Código postal *
            </label>
            <input
              type="text"
              name="cp"
              value={direccion.cp}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primaryHover transition"
          >
            Guardar y continuar →
          </button>
        </div>
      </form>
    </div>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useClienteAuth } from "@/context/ClienteAuthContext"; // ← AÑADIR ESTO
// import { getCart } from "@/lib/cartService"; // ← AÑADIR ESTO

// export default function DireccionPage() {
//   const router = useRouter();
//   const { cliente } = useClienteAuth(); // ← AÑADIR ESTO

//   const [direccion, setDireccion] = useState({
//     nombre: cliente?.nombre || "", // ← PRECARGAR datos del cliente
//     email: cliente?.email || "",
//     telefono: cliente?.telefono || "",
//     direccion: cliente?.direccion || "",
//     ciudad: cliente?.ciudad || "",
//     cp: cliente?.cp || "",
//   });

//   useEffect(() => {
//     const cart = getCart(); // ← VERIFICAR CARRITO
//     if (cart.length === 0) {
//       router.push("/carrito");
//       return;
//     }

//     // Si no hay cliente logueado
//     if (!cliente) {
//       router.push("/login");
//       return;
//     }

//     // Cargar datos anteriores si existen
//     const datosGuardados = localStorage.getItem("checkout_direccion");
//     if (datosGuardados) {
//       setDireccion(JSON.parse(datosGuardados));
//     }
//   }, [router, cliente]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setDireccion((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     console.log("🛒 GUARDANDO:", direccion); // DEBUG

//     if (
//       !direccion.nombre ||
//       !direccion.email ||
//       !direccion.telefono ||
//       !direccion.direccion ||
//       !direccion.ciudad ||
//       !direccion.cp
//     ) {
//       alert("Por favor, completa todos los campos obligatorios.");
//       return;
//     }

//     // ✅ GUARDAR - TU CÓDIGO ESTABA BIEN
//     localStorage.setItem("checkout_direccion", JSON.stringify(direccion));
//     console.log("✅ checkout_direccion guardado"); // DEBUG

//     router.push("/checkout/envio");
//   };

//   if (!cliente) {
//     return (
//       <div className="max-w-3xl mx-auto px-4 py-10 text-center">
//         <h1 className="text-2xl font-bold mb-4">Necesitas iniciar sesión</h1>
//         <button
//           onClick={() => router.push("/login")}
//           className="bg-primary text-white px-6 py-2 rounded font-semibold"
//         >
//           Ir al login →
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold mb-6">Dirección de envío 🏠</h1>
      
//       {/* MOSTRAR DATOS DEL CLIENTE */}
//       <div className="bg-blue-50 p-4 rounded-lg mb-6">
//         <p className="font-semibold text-sm mb-1">Datos precargados:</p>
//         <p className="text-sm text-gray-700">{cliente.nombre} {cliente.apellidos}</p>
//         <p className="text-sm text-gray-700">{cliente.email}</p>
//       </div>

//       <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Nombre completo *</label>
//           <input
//             type="text"
//             name="nombre"
//             value={direccion.nombre}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Email *</label>
//           <input
//             type="email"
//             name="email"
//             value={direccion.email}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Teléfono *</label>
//           <input
//             type="tel"
//             name="telefono"
//             value={direccion.telefono}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Dirección *</label>
//           <input
//             type="text"
//             name="direccion"
//             value={direccion.direccion}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Ciudad *</label>
//             <input
//               type="text"
//               name="ciudad"
//               value={direccion.ciudad}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Código postal *</label>
//             <input
//               type="text"
//               name="cp"
//               value={direccion.cp}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
//               required
//             />
//           </div>
//         </div>

//         <div className="flex justify-end pt-4">
//           <button
//             type="submit"
//             className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primaryHover transition"
//           >
//             Continuar con el envío →
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
