import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function verifyToken(req: Request, tipo: 'cliente' | 'admin') {
  const header = req.headers.get('authorization');
  if (!header || !header.startsWith('Bearer '))
    return NextResponse.json({ error: 'Token requerido' }, { status: 401 });

  const token = header.split(' ')[1];
  const secret =
    tipo === 'admin'
      ? process.env.SECRETO_JWT_ADMIN
      : process.env.SECRETO_JWT_CLIENTE;

  try {
    const decoded: any = jwt.verify(token, secret!);
    return decoded; // devolvemos el objeto con id, email, rol, etc.
  } catch (err) {
    console.error('❌ Token inválido:', err);
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
  }
}
