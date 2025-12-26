// lib/mongoose.js
import mongoose, { Mongoose } from "mongoose";

declare global {
  
  var mongooseGlobal:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Define MONGODB_URI en .env.local');
}
// Inicializar cache si no existe
const globalCache = global.mongooseGlobal || {
  conn: null,
  promise: null,
};
global.mongooseGlobal = globalCache;

// ✅ Tipar variable local garantizando valor
const cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null } =
  globalCache;

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("✅ Conectado a MongoDB");
      return m;
    });
  }

  cached.conn = await cached.promise;

  // Importar modelos una sola vez
  await import("../models/Producto");
  await import("../models/Cliente");
  await import("../models/Usuario");
  await import("../models/Pedido");
  await import("../models/Categoria");
  await import("../models/Marca");

  return cached.conn;
}

export default dbConnect;