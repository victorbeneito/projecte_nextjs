import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);
    
    const { email, password } = await req.json();
    
    // Buscar usuario
    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    if (!usuario) {
      return NextResponse.json({ ok: false, error: 'Usuario no encontrado' }, { status: 401 });
    }
    
    // Verificar contraseña
    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return NextResponse.json({ ok: false, error: 'Contraseña incorrecta' }, { status: 401 });
    }
    
    // Crear JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || 'tu-secreto-super-seguro',
      { expiresIn: '24h' }
    );
    
    return NextResponse.json({ ok: true, token });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: 'Error de servidor' }, { status: 500 });
  }
}
