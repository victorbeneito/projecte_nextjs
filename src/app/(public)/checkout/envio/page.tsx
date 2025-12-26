"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useClienteAuth } from "@/context/ClienteAuthContext";

export default function EnvioPage() {
  const router = useRouter();
  const { cliente, loading } = useClienteAuth();
  const [envioSeleccionado, setEnvioSeleccionado] = useState<string | null>(null);

  // ✅ Verificar que el usuario esté logueado
  useEffect(() => {
    if (!loading) {
      if (!cliente) {
        toast.error("Debes iniciar sesión antes de continuar.");
        router.push("/auth?redirect=/checkout/envio");
        return;
      }
      // 🚫 Ya no comprobamos aquí los datos de dirección,
      // porque esa validación se hace cuando presiona "Finalizar compra" en el carrito.
    }
  }, [cliente, loading, router]);

  // ✅ Cargar método de envío guardado (si existe)
  useEffect(() => {
    const envioGuardado = localStorage.getItem("checkout_envio");
    if (envioGuardado) {
      setEnvioSeleccionado(JSON.parse(envioGuardado).metodo);
    }
  }, []);

  const handleContinue = () => {
    if (!envioSeleccionado) {
      toast.error("Por favor selecciona un método de envío antes de continuar.");
      return;
    }

    const envioData = {
      metodo: envioSeleccionado,
      coste: envioSeleccionado === "ontime" ? 5 : 0,
    };

    localStorage.setItem("checkout_envio", JSON.stringify(envioData));
    router.push("/checkout/pago");
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Método de envío 🚚</h1>

      <div className="space-y-4">
        {/* Recogida en tienda */}
        <label
          className={`block border rounded-lg p-4 cursor-pointer transition ${
            envioSeleccionado === "tienda"
              ? "border-primary bg-primary/10"
              : "border-gray-200 hover:border-primary"
          }`}
        >
          <input
            type="radio"
            name="envio"
            value="tienda"
            checked={envioSeleccionado === "tienda"}
            onChange={() => setEnvioSeleccionado("tienda")}
            className="mr-3"
          />
          <span className="font-medium text-gray-800">
            🏬 El Hogar de tus Sueños — Recogida en tienda
          </span>
          <p className="text-sm text-gray-600 ml-6">Gratis</p>
        </label>

        {/* Ontime */}
        <label
          className={`block border rounded-lg p-4 cursor-pointer transition ${
            envioSeleccionado === "ontime"
              ? "border-primary bg-primary/10"
              : "border-gray-200 hover:border-primary"
          }`}
        >
          <input
            type="radio"
            name="envio"
            value="ontime"
            checked={envioSeleccionado === "ontime"}
            onChange={() => setEnvioSeleccionado("ontime")}
            className="mr-3"
          />
          <span className="font-medium text-gray-800">
            🚚 Ontime — 24–72 horas desde el envío
          </span>
          <p className="text-sm text-gray-600 ml-6">5 €</p>
        </label>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleContinue}
          className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primaryHover transition"
        >
          Continuar al pago →
        </button>
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function EnvioPage() {
//   const router = useRouter();
//   const [envioSeleccionado, setEnvioSeleccionado] = useState<string | null>(null);

//   useEffect(() => {
//     const envioGuardado = localStorage.getItem("checkout_envio");
//     if (envioGuardado) {
//       setEnvioSeleccionado(JSON.parse(envioGuardado).metodo);
//     }
//   }, []);

//   const handleContinue = () => {
//     if (!envioSeleccionado) {
//       alert("Por favor selecciona un método de envío antes de continuar.");
//       return;
//     }

//     // definimos coste de envío
//     const envioData = {
//       metodo: envioSeleccionado,
//       coste: envioSeleccionado === "ontime" ? 5 : 0,
//     };

//     // guardamos en localStorage
//     localStorage.setItem("checkout_envio", JSON.stringify(envioData));

//     // continuo al paso pago
//     router.push("/checkout/pago");
//   };

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-12">
//       <h1 className="text-3xl font-bold mb-6">Método de envío 🚚</h1>

//       <div className="space-y-4">
//         {/* Recogida en tienda */}
//         <label
//           className={`block border rounded-lg p-4 cursor-pointer transition ${
//             envioSeleccionado === "tienda"
//               ? "border-primary bg-primary/10"
//               : "border-gray-200 hover:border-primary"
//           }`}
//         >
//           <input
//             type="radio"
//             name="envio"
//             value="tienda"
//             checked={envioSeleccionado === "tienda"}
//             onChange={() => setEnvioSeleccionado("tienda")}
//             className="mr-3"
//           />
//           <span className="font-medium text-gray-800">
//             🏬 El Hogar de tus Sueños — Recogida en tienda
//           </span>
//           <p className="text-sm text-gray-600 ml-6">Gratis</p>
//         </label>

//         {/* Ontime */}
//         <label
//           className={`block border rounded-lg p-4 cursor-pointer transition ${
//             envioSeleccionado === "ontime"
//               ? "border-primary bg-primary/10"
//               : "border-gray-200 hover:border-primary"
//           }`}
//         >
//           <input
//             type="radio"
//             name="envio"
//             value="ontime"
//             checked={envioSeleccionado === "ontime"}
//             onChange={() => setEnvioSeleccionado("ontime")}
//             className="mr-3"
//           />
//           <span className="font-medium text-gray-800">
//             🚚 Ontime — 24–72 horas desde el envío
//           </span>
//           <p className="text-sm text-gray-600 ml-6">5 €</p>
//         </label>
//       </div>

//       <div className="flex justify-end mt-8">
//         <button
//           onClick={handleContinue}
//           className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primaryHover transition"
//         >
//           Continuar al pago →
//         </button>
//       </div>
//     </div>
//   );
// }
