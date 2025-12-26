"use client";

import { useClienteAuth } from "@/context/ClienteAuthContext";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import toast from "react-hot-toast";
import CambiarPassword from "@/components/CambiarPassword";
import CambiarEmail from "@/components/CambiarEmail";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";

export default function InfoPage() {
  const { cliente, token, setCliente } = useClienteAuth();
  const [formData, setFormData] = useState(cliente || {});
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const redirectAfterSave = params.get("redirect"); // si viene del checkout

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || "",
        apellidos: cliente.apellidos || "",
        empresa: cliente.empresa || "",
        direccion: cliente.direccion || "",
        direccionComplementaria: cliente.direccionComplementaria || "",
        codigoPostal: cliente.codigoPostal || "",
        ciudad: cliente.ciudad || "",
        provincia: cliente.provincia || "",
        pais: cliente.pais || "España",
        nif: cliente.nif || "",
        telefono: cliente.telefono || "",
      });
    }
  }, [cliente]);

  if (!cliente) return <p>Cargando datos del cliente...</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);

    try {
      const decoded: any = jwtDecode(token);
      console.log("decoded.id del token →", decoded.id);
      console.log("cliente.id que se envía →", cliente.id);

      const res = await fetchWithAuth(`/api/clientes/${cliente.id}`, token, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (res.error) {
        toast.error(res.error);
        setSaving(false);
        return;
      }

      setCliente(res.cliente);
      localStorage.setItem("cliente_datos", JSON.stringify(res.cliente));
      toast.success("Información actualizada correctamente ✅");

      // si viene del checkout, regresar automáticamente al flujo
      if (redirectAfterSave) {
        router.push(redirectAfterSave);
      }
    } catch (error) {
      toast.error("Error al guardar los cambios");
      console.error("❌", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Información personal</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-10">
        {[
          { name: "nombre", label: "Nombre" },
          { name: "apellidos", label: "Apellidos" },
          { name: "empresa", label: "Empresa" },
          { name: "nif", label: "NIF" },
          { name: "telefono", label: "Teléfono" },
          { name: "direccion", label: "Dirección" },
          { name: "direccionComplementaria", label: "Dirección complementaria" },
          { name: "codigoPostal", label: "Código Postal" },
          { name: "ciudad", label: "Ciudad" },
          { name: "provincia", label: "Provincia" },
          { name: "pais", label: "País (por defecto España)" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={(formData as any)[name] || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      {/* Email y contraseña */}
      <CambiarEmail />
      <CambiarPassword />
    </div>
  );
}


// "use client";

// import { useClienteAuth } from "@/context/ClienteAuthContext";
// import { useState } from "react";
// import { fetchWithAuth } from "@/utils/fetchWithAuth";
// import toast from "react-hot-toast";
// import CambiarPassword from "@/components/CambiarPassword";
// import CambiarEmail from "@/components/CambiarEmail";
// import { jwtDecode } from "jwt-decode";


// export default function InfoPage() {
//   const { cliente, token, setCliente } = useClienteAuth();
//   const [formData, setFormData] = useState(cliente || {});
//   const [saving, setSaving] = useState(false);

//   if (!cliente) return <p>Cargando datos del cliente...</p>;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token) return;

//     setSaving(true);
//     try {
//         if (token) {
//   const decoded: any = jwtDecode(token);
//   console.log("decoded.id del token →", decoded.id);
// }
// console.log("cliente.id que se envía →", cliente.id);
//       const res = await fetchWithAuth(`/api/clientes/${cliente.id}`, token, {
//         method: "PUT",
//         body: JSON.stringify(formData),
//       });

//       setCliente(res.cliente);
//       toast.success("Información actualizada correctamente");
//     } catch (error) {
//       toast.error("Error al guardar los cambios");
//       console.error(error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Información personal</h1>

//       {/* ✅ FORMULARIO PRINCIPAL SOLO PARA INFORMACIÓN PERSONAL */}
//       <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-10">
//         {["nombre", "apellidos", "telefono", "direccion", "ciudad", "cp"].map((field) => (
//           <div key={field}>
//             <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
//             <input
//               type="text"
//               name={field}
//               value={(formData as any)[field] || ""}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>
//         ))}

//         <button
//           type="submit"
//           disabled={saving}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
//         >
//           {saving ? "Guardando..." : "Guardar cambios"}
//         </button>
//       </form>

//       {/* 📧 CAMBIO DE EMAIL */}
//       <CambiarEmail />

//       {/* 🔐 CAMBIO DE CONTRASEÑA */}
//       <CambiarPassword />
//     </div>
//   );
// }
