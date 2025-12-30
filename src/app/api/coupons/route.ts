import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Cupon from "@/models/Cupon";
import jwt from "jsonwebtoken";

// 🔹 Obtener cupones del cliente autenticado
export async function GET(req: Request) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.SECRETO_JWT_CLIENTE!);
    if (typeof decoded === "string" || !decoded.id) {
      return NextResponse.json({ error: "Token inválido" }, { status: 403 });
    }

    // 🔹 Buscar cupones globales + cupones asignados a este cliente
    const cupones = await Cupon.find({
      $or: [{ clienteId: null }, { clienteId: decoded.id }],
    }).sort({ fechaExpiracion: 1 });

    return NextResponse.json({ coupons: cupones });
  } catch (error) {
    console.error("❌ Error al obtener cupones:", error);
    return NextResponse.json({ error: "Error al obtener cupones" }, { status: 500 });
  }
}

// 🔹 (Opcional) Crear cupón (para pruebas/admin)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    const nuevo = new Cupon(data);
    await nuevo.save();

    return NextResponse.json({ message: "Cupón creado", cupon: nuevo });
  } catch (error) {
    console.error("❌ Error al crear cupón:", error);
    return NextResponse.json({ error: "No se pudo crear el cupón" }, { status: 500 });
  }
}
