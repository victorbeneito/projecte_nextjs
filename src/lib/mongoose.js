// lib/mongoose.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Define MONGODB_URI en .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // Importar modelos
  await import('../models/Producto.js');
  await import('../models/Cliente.js');
  await import('../models/Usuario.js');
  await import('../models/Pedido.js');
  await import('../models/Categoria.js');
  await import('../models/Marca.js');

  return cached.conn;
}

export default dbConnect;
