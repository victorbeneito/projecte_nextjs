import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import Pedido from "@/models/Pedido";
import Cliente from "@/models/Cliente";
import Cupon from "@/models/Cupon";

/**
 * Crea un pedido real en MongoDB desde el checkout
 * Recibe: { carrito, metodoEnvio, metodoPago, descuento, totalFinal, cupón }
 */
export async function POST(req: Request) {
  try {
    await dbConnect();

    // 1️⃣  Verificamos el token del usuario
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Token requerido" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.SECRETO_JWT!);
    if (typeof decoded === "string" || !decoded.id)
      return NextResponse.json({ error: "Token inválido" }, { status: 403 });

    // 2️⃣  Leemos datos del cuerpo del POST
    const body = await req.json();
    const { carrito, metodoEnvio, metodoPago, descuento, totalFinal, cuponCodigo } = body;

    if (!carrito || carrito.length === 0)
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });

    // 3️⃣  Buscamos al cliente
    const cliente = await Cliente.findById(decoded.id);
    if (!cliente)
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

    // 4️⃣  Marcamos el cupón como usado (si existe)
    let cuponUsado = null;
    if (cuponCodigo) {
      cuponUsado = await Cupon.findOneAndUpdate(
        { codigo: cuponCodigo.toUpperCase() },
        { usado: true },
        { new: true }
      );
    }

    // 5️⃣  Creamos el pedido
    const nuevoPedido = new Pedido({
      clienteId: cliente._id,
      cliente: {
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        ciudad: cliente.ciudad,
        cp: cliente.cp,
      },
      envio: metodoEnvio,
      pago: metodoPago,
      productos: carrito.map((p: any) => ({
        productoId: p._id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precioUnitario: p.precioFinal ?? p.precio,
        subtotal: (p.precioFinal ?? p.precio) * p.cantidad,
      })),
      estado: "pendiente",
      fechaPedido: new Date(),
      numeroPedido: "", // se rellena automáticamente en el middleware pre("save")
      cupon: cuponUsado
        ? { codigo: cuponUsado.codigo, descuento: cuponUsado.descuento }
        : undefined,
      totalFinal,
      descuento,
    });

    if (body.cuponCodigo) {
  await Cupon.updateOne(
    { codigo: body.cuponCodigo },
    { $addToSet: { clientesUsados: decoded.id } } // evita duplicados
  );
}


    await nuevoPedido.save();

    return NextResponse.json({
      message: "Pedido creado correctamente",
      pedido: nuevoPedido,
    });
  } catch (error) {
    console.error("❌ Error creando pedido:", error);
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 });
  }

}
