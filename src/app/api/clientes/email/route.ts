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

    const { password, newEmail } = await req.json();

    if (!newEmail || !password) {
      return NextResponse.json({ error: "Debes ingresar tu contraseña y el nuevo email" }, { status: 400 });
    }

    const cliente = await Cliente.findById(decoded.id);
    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const match = await bcrypt.compare(password, cliente.password);
    if (!match) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    // Evitar emails duplicados
    const emailExistente = await Cliente.findOne({ email: newEmail });
    if (emailExistente && emailExistente.id !== cliente.id) {
      return NextResponse.json({ error: "Ese correo ya está registrado" }, { status: 409 });
    }

    cliente.email = newEmail;
    await cliente.save();

    return NextResponse.json({ message: "Email actualizado correctamente", email: cliente.email });
  } catch (error) {
    console.error("❌ Error al cambiar email:", error);
    return NextResponse.json({ error: "Error al cambiar el correo" }, { status: 500 });
  }
}
