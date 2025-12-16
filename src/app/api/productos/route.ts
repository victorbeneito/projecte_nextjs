import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

const marcaSchema = new mongoose.Schema({ nombre: String });
const categoriaSchema = new mongoose.Schema({ nombre: String });

const Marca =
  mongoose.models.Marca || mongoose.model("Marca", marcaSchema);
const Categoria =
  mongoose.models.Categoria || mongoose.model("Categoria", categoriaSchema);

const productoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  stock: Number,
  marca: { type: mongoose.Schema.Types.ObjectId, ref: "Marca" },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria" },
  imagenes: [String],
  categorias: [String],
});

const Producto =
  mongoose.models.Producto || mongoose.model("Producto", productoSchema);

// GET /api/productos
export async function GET(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria");
    const q = searchParams.get("q");

    const filtro: any = {};
    if (categoria) filtro.categoria = categoria;
    if (q) filtro.nombre = { $regex: q, $options: "i" };

    const productos = await Producto.find(filtro).populate("marca categoria");

    console.log(
      "Ejemplo producto poblado:",
      JSON.stringify(productos[0], null, 2)
    );

    return NextResponse.json({ ok: true, productos });
  } catch (error: any) {
    console.error("❌ Error en GET /api/productos:", error.message);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/productos
export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const body = await req.json();

    // Buscar marca y categoría por nombre (como tenías antes)
    const marcaData = await Marca.findOne({ nombre: body.marca });
    const categoriaData = await Categoria.findOne({ nombre: body.categoria });

    if (!marcaData) {
      return NextResponse.json(
        { ok: false, error: `Marca "${body.marca}" no encontrada` },
        { status: 400 }
      );
    }

    if (!categoriaData) {
      return NextResponse.json(
        { ok: false, error: `Categoría "${body.categoria}" no encontrada` },
        { status: 400 }
      );
    }

    const productoData = {
      nombre: body.nombre,
      descripcion: body.descripcion || "",
      precio: parseFloat(body.precio),
      stock: parseInt(body.stock),
      marca: marcaData._id,
      categoria: categoriaData._id,
      imagenes: body.imagenes || [],
      categorias: body.categorias || [],
    };

    const producto = new Producto(productoData);
    await producto.save();

    // devolver ya populado
    const productoPopulado = await Producto.findById(producto._id).populate(
      "marca categoria"
    );

    return NextResponse.json(
      { ok: true, producto: productoPopulado },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Error /api/productos:", error.message);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 400 }
    );
  }
}
