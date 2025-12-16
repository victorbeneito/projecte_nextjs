// src/app/api/categorias/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({ nombre: String });

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Categoria = mongoose.models.Categoria || mongoose.model('Categoria', categoriaSchema);
    const categorias = await Categoria.find({}).sort({ nombre: 1 });
    return NextResponse.json({ ok: true, categorias });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
