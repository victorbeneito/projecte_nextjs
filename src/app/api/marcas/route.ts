// src/app/api/marcas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const marcaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  logo_url: String
});

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Marca = mongoose.models.Marca || mongoose.model('Marca', marcaSchema);
    
    const marcas = await Marca.find({})
      .sort({ nombre: 1 });
      
    return NextResponse.json({ ok: true, marcas });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Marca = mongoose.models.Marca || mongoose.model('Marca', marcaSchema);
    
    const body = await req.json();
    const marca = new Marca(body);
    await marca.save();
    
    return NextResponse.json({ ok: true, marca }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Marca = mongoose.models.Marca || mongoose.model('Marca', marcaSchema);
    
    const body = await req.json();
    const marca = await Marca.findByIdAndUpdate(params.id, body, { new: true });
    
    if (!marca) {
      return NextResponse.json({ ok: false, error: 'Marca no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true, marca });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Marca = mongoose.models.Marca || mongoose.model('Marca', marcaSchema);
    
    const marca = await Marca.findByIdAndDelete(params.id);
    if (!marca) {
      return NextResponse.json({ ok: false, error: 'Marca no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true, mensaje: 'Marca eliminada' });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
