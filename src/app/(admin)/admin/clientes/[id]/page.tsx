"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  cp?: string;
}

interface Pedido {
  _id: string;
  fecha: string;
  pago: { totalFinal: number };
  estado: string;
}

export default function ClienteDetallePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [modificando, setModificando] = useState(false);
  const id = params.id;

  useEffect(() => {
    const fetchClienteDetalle = async () => {
      try {
        const [resCliente, resPedidos] = await Promise.all([
          fetch(`/api/clientes/${id}`),
          fetch(`/api/pedidos?cliente=${id}`),
        ]);
        const dataCliente = await resCliente.json();
        const dataPedidos = await resPedidos.json();

        setCliente(dataCliente.cliente);
        setPedidos(dataPedidos.pedidos || []);
      } catch (error) {
        console.error("Error al cargar cliente:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClienteDetalle();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : prev
    );
  };

  const handleUpdate = async () => {
    if (!cliente) return;
    try {
      const res = await fetch(`/api/clientes/${cliente._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });
      if (res.ok) {
        alert("✅ Cliente actualizado correctamente");
        setModificando(false);
      } else {
        alert("Error al actualizar cliente");
      }
    } catch (error) {
      console.error("Error actualizando cliente:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando cliente...
      </div>
    );

  if (!cliente)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cliente no encontrado.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F8F5] py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-[#4A4A4A] mb-8">
          👤 Detalles del Cliente
        </h1>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#6BAEC9]/10 space-y-6">
          <div className="border-b pb-4 flex justify-between items-start md:items-center">
            <div>
              <p className="text-gray-500 text-sm mb-1">
                ID Cliente:{" "}
                <span className="font-mono text-[#6BAEC9]">{cliente._id}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Email: <span className="font-semibold">{cliente.email}</span>
              </p>
            </div>
            {!modificando && (
              <button
                onClick={() => setModificando(true)}
                className="px-4 py-2 text-sm rounded-lg bg-[#6BAEC9]/10 text-[#6BAEC9] hover:bg-[#6BAEC9]/20 transition"
              >
                ✏️ Editar datos
              </button>
            )}
          </div>

          {/* Datos personales */}
          <section>
            <h2 className="text-xl font-semibold text-[#4A4A4A] mb-3">
              Datos personales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  disabled={!modificando}
                  value={cliente.nombre}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    modificando
                      ? "border-[#6BAEC9]/50 focus:ring-2 focus:ring-[#6BAEC9]"
                      : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  disabled={!modificando}
                  value={cliente.telefono || ""}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    modificando
                      ? "border-[#6BAEC9]/50 focus:ring-2 focus:ring-[#6BAEC9]"
                      : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  disabled={!modificando}
                  value={cliente.direccion || ""}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    modificando
                      ? "border-[#6BAEC9]/50 focus:ring-2 focus:ring-[#6BAEC9]"
                      : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ciudad"
                  disabled={!modificando}
                  value={cliente.ciudad || ""}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    modificando
                      ? "border-[#6BAEC9]/50 focus:ring-2 focus:ring-[#6BAEC9]"
                      : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="cp"
                  disabled={!modificando}
                  value={cliente.cp || ""}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    modificando
                      ? "border-[#6BAEC9]/50 focus:ring-2 focus:ring-[#6BAEC9]"
                      : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>
            </div>
          </section>

          {/* Pedidos del cliente */}
          <section>
            <h2 className="text-xl font-semibold text-[#4A4A4A] mb-3">
              Pedidos del cliente
            </h2>

            {pedidos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8F8F5]">
                    <tr>
                      <th className="text-left px-4 py-2">ID Pedido</th>
                      <th className="text-center px-4 py-2">Fecha</th>
                      <th className="text-center px-4 py-2">Total (€)</th>
                      <th className="text-center px-4 py-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((p) => (
                      <tr
                        key={p._id}
                        className="border-t hover:bg-[#F8F8F5] cursor-pointer"
                        onClick={() => router.push(`/admin/pedidos/${p._id}`)}
                      >
                        <td className="px-4 py-2 font-mono text-[#6BAEC9]">
                          {p._id.slice(-8)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {new Date(p.fecha).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-center font-semibold text-[#F7A38B]">
                          {p.pago?.totalFinal.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-center capitalize">
                          {p.estado}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay pedidos registrados.</p>
            )}
          </section>
        </div>

        {/* Botones finales */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => router.push("/admin/clientes")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-400 to-gray-300 hover:from-gray-500 hover:to-gray-400 shadow-md transition-all duration-300"
          >
            ← Volver a Clientes
          </button>

          {modificando && (
            <button
              onClick={handleUpdate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6BAEC9] to-[#A8D7E6] hover:from-[#5FA0B3] hover:to-[#91C8D9] shadow-md transition-all duration-300"
            >
              💾 Guardar cambios
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
