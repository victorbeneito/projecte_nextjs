// api/coupons/use/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Cupon from "@/models/Cupon";

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { codigo } = await req.json();
    const cupon = await Cupon.findOneAndUpdate(
      { codigo: codigo.toUpperCase() },
      { usado: true },
      { new: true }
    );
    if (!cupon) return NextResponse.json({ error: "Cupón no encontrado" }, { status: 404 });
    return NextResponse.json({ message: "Cupón marcado como usado", cupon });
  } catch (error) {
    console.error("❌ Error al marcar cupón usado:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
