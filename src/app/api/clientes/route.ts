// src/app/api/clientes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const clienteSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  telefono: String
});

export async function GET(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Cliente = mongoose.models.Cliente || mongoose.model('Cliente', clienteSchema);

    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ ok: false, error: 'Token requerido' }, { status: 401 });
    }

    const token = auth.replace('Bearer ', '');
    jwt.verify(token, process.env.SECRETO_JWT!);

    const clientes = await Cliente.find({});
    return NextResponse.json({ ok: true, clientes });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Cliente = mongoose.models.Cliente || mongoose.model('Cliente', clienteSchema);

    const cliente = new Cliente(await req.json());
    await cliente.save();
    return NextResponse.json({ ok: true, cliente }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
