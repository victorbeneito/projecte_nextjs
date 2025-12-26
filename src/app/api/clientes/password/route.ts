import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import Cliente from "@/models/Cliente";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.SECRETO_JWT!);
    if (typeof decoded === "string" || !decoded.id) {
      return NextResponse.json({ error: "Token inválido" }, { status: 403 });
    }

    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Debes ingresar las contraseñas" },
        { status: 400 }
      );
    }

    const cliente = await Cliente.findById(decoded.id);
    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const match = await bcrypt.compare(oldPassword, cliente.password);
    if (!match) {
      return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
    }

    cliente.password = await bcrypt.hash(newPassword, 10);
    await cliente.save();

    return NextResponse.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error en cambio de contraseña:", error);
    return NextResponse.json(
      { error: "Error al cambiar la contraseña" },
      { status: 500 }
    );
  }
}
