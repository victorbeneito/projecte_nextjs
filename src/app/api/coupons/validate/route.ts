import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Cupon from "@/models/Cupon";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.SECRETO_JWT_CLIENTE!);
    if (typeof decoded === "string" || !decoded.id) {
      return NextResponse.json({ error: "Token inválido" }, { status: 403 });
    }

    const { codigo } = await req.json();
    if (!codigo) {
      return NextResponse.json({ error: "Debes proporcionar un código" }, { status: 400 });
    }

    const upperCode = codigo.toUpperCase().trim();

    // Buscar el cupón (global o asignado al cliente)
    const cupon = await Cupon.findOne({
      codigo: upperCode,
      $or: [{ clienteId: null }, { clienteId: decoded.id }],
    });

    if (!cupon) {
      return NextResponse.json({ valid: false, error: "Cupón no encontrado" }, { status: 404 });
    }

    // Expirado
    if (new Date(cupon.fechaExpiracion) < new Date()) {
      return NextResponse.json({ valid: false, error: "Cupón expirado" }, { status: 400 });
    }

    // Si ese cliente ya lo usó
    if (cupon.clientesUsados?.includes(decoded.id)) {
      return NextResponse.json({ valid: false, error: "Ya has usado este cupón" }, { status: 400 });
    }

    // Si el cupón fue marcado como usado globalmente (por seguridad)
    if (cupon.usado) {
      return NextResponse.json({ valid: false, error: "Cupón no disponible" }, { status: 400 });
    }

    // ✅ Cupón válido → devolver datos
    return NextResponse.json({
      valid: true,
      codigo: cupon.codigo,
      descuento: cupon.descuento,
      descripcion: cupon.descripcion,
      fechaExpiracion: cupon.fechaExpiracion,
    });
  } catch (error) {
    console.error("❌ Error al validar cupón:", error);
    return NextResponse.json({ error: "Error al validar el cupón" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongoose";
// import Cupon from "@/models/Cupon";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   try {
//     await dbConnect();

//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return NextResponse.json({ error: "Token requerido" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.SECRETO_JWT!);
//     if (typeof decoded === "string" || !decoded.id) {
//       return NextResponse.json({ error: "Token inválido" }, { status: 403 });
//     }

//     const { codigo } = await req.json();
//     if (!codigo) {
//       return NextResponse.json({ error: "Debes proporcionar un código" }, { status: 400 });
//     }

//     // Normalizamos código
//     const upperCode = codigo.toUpperCase().trim();

//     // Buscar el cupón correspondiente (global o asignado al cliente)
//     const cupon = await Cupon.findOne({
//       codigo: upperCode,
//       $or: [{ clienteId: null }, { clienteId: decoded.id }],
//     });

//     if (!cupon) {
//       return NextResponse.json({ valid: false, error: "Cupón no encontrado" }, { status: 404 });
//     }

//     // Comprobar si expiró
//     if (new Date(cupon.fechaExpiracion) < new Date()) {
//       return NextResponse.json({ valid: false, error: "Cupón expirado" }, { status: 400 });
//     }

//     if (cupon.usado) {
//       return NextResponse.json({ valid: false, error: "Cupón ya utilizado" }, { status: 400 });
//     }

//     // 🔹 Si todo está bien, devolvemos los datos del cupón
//     return NextResponse.json({
//       valid: true,
//       codigo: cupon.codigo,
//       descuento: cupon.descuento,
//       descripcion: cupon.descripcion,
//       fechaExpiracion: cupon.fechaExpiracion,
//     });
//   } catch (error) {
//     console.error("❌ Error al validar cupón:", error);
//     return NextResponse.json({ error: "Error al validar el cupón" }, { status: 500 });
//   }
// }
