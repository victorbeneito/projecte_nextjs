import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Pedido from "@/models/Pedido";
import Cliente from "@/models/Cliente";
import jwt from "jsonwebtoken";

/* *************************************
   🧰 CREAR PEDIDO (POST)
************************************* */
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    // 📌 Buscamos si el cliente existe por email
    let clienteId = null;
    let clienteData = body?.cliente || {};

    if (clienteData?.email) {
      const existingClient = await Cliente.findOne({ email: clienteData.email });
      if (existingClient) {
        clienteId = existingClient._id;
      }
    }

    // 📦 Creamos el nuevo pedido siguiendo el modelo híbrido
    const nuevoPedido = new Pedido({
      clienteId: clienteId,
      cliente: clienteData,
      envio: body.envio,
      pago: body.pago,
      productos: body.productos || [],
      estado: body.estado || "pendiente",
      fechaPedido: new Date(),
    });

    await nuevoPedido.save();

    return NextResponse.json({
      ok: true,
      message: "✅ Pedido creado correctamente",
      pedido: nuevoPedido,
    });
  } catch (error) {
    console.error("❌ Error al crear el pedido:", error);
    return NextResponse.json(
      { ok: false, error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}

/* *************************************
   🧾 LISTAR PEDIDOS (GET)
************************************* */
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const clienteParam = searchParams.get("cliente");
    const token = req.headers.get("authorization")?.split(" ")[1];

    let filtro: any = {};

    // 🧾 Si pasas un parámetro manualmente (?cliente=)
    if (clienteParam) {
      const esObjectId = clienteParam.length === 24 && /^[a-f0-9]+$/i.test(clienteParam);
      filtro = esObjectId
        ? { clienteId: clienteParam }
        : { "cliente.email": clienteParam };
    } else if (token) {
      // 🔑 Si viene del token JWT
      const decoded: any = jwt.verify(token, process.env.SECRETO_JWT_CLIENTE!);
      if (decoded?.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
        filtro.clienteId = new mongoose.Types.ObjectId(decoded.id);
      } else if (decoded?.email) {
        filtro["cliente.email"] = decoded.email;
      }
    }

    // 🔍 Buscamos los pedidos
    const pedidos = await Pedido.find(filtro).sort({ createdAt: -1 }).lean();

    // 🔄 Si no encuentra ninguno por ID, intentamos también por email
    if (pedidos.length === 0 && filtro.clienteId) {
      const clienteEmail = await Cliente.findById(filtro.clienteId).select("email").lean();
      if (clienteEmail?.email) {
        const pedidosEmail = await Pedido.find({ "cliente.email": clienteEmail.email }).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ pedidos: pedidosEmail });
      }
    }

    return NextResponse.json({ pedidos });
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error);
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}
