import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Cliente from "@/models/Cliente";
import jwt from "jsonwebtoken";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.SECRETO_JWT!);
    if (typeof decoded === "string" || decoded.id !== params.id) {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }

    const cliente = await Cliente.findById(params.id).lean();
    if (!cliente)
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

    delete cliente.password;
    return NextResponse.json({ cliente });
  } catch (error) {
    console.error("❌ Error al obtener cliente:", error);
    return NextResponse.json(
      { error: "Error al obtener el cliente" },
      { status: 500 }
    );
  }
}


export async function PUT( req: Request, context: { params: Promise<{ id: string }> } ) {

    const { id } = await context.params;
  try {
    console.log("✅ Entrando en PUT /api/clientes/[id]");
    await dbConnect();
    console.log("✅ Conexión a Mongo establecida");

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.SECRETO_JWT!);
    console.log("decoded.id =>", decoded.id, " | id =>", id);

    if (typeof decoded === "string" || decoded.id !== id) {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }

    const body = await req.json();
    console.log("📦 Body recibido:", body);

    const { password, email, ...safeBody } = body;
    console.log("➡️ safeBody enviado a Mongo:", safeBody);

    const clienteActualizado = await Cliente.findByIdAndUpdate(id, safeBody, {
      new: true,
    });

    console.log("📄 Respuesta de Mongo:", clienteActualizado);

    if (!clienteActualizado)
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

    return NextResponse.json({
      message: "Cliente actualizado correctamente",
      cliente: clienteActualizado,
    });
  } catch (error: any) {
    console.error("❌ Error al actualizar cliente ->", error);
    return NextResponse.json({ error: error.message || "Error al actualizar el cliente" }, { status: 500 });
  }
}



export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.SECRETO_JWT!);
    if (typeof decoded === "string" || decoded.id !== params.id) {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }

    const cliente = await Cliente.findByIdAndDelete(params.id);
    if (!cliente)
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar cliente:", error);
    return NextResponse.json(
      { error: "Error al eliminar el cliente" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongoose";
// import Cliente from "@/models/Cliente";

// // 🧩 Obtener un cliente por ID
// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await dbConnect();
//     const cliente = await Cliente.findById(params.id).lean();

//     if (!cliente)
//       return NextResponse.json(
//         { error: "Cliente no encontrado" },
//         { status: 404 }
//       );

//     return NextResponse.json({ cliente });
//   } catch (error) {
//     console.error("Error al obtener cliente:", error);
//     return NextResponse.json(
//       { error: "Error al obtener el cliente" },
//       { status: 500 }
//     );
//   }
// }

// // ✏️ Actualizar un cliente
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   try {
//     await dbConnect();
//     const body = await req.json();

//     const clienteActualizado = await Cliente.findByIdAndUpdate(
//       params.id,
//       body,
//       { new: true }
//     );

//     if (!clienteActualizado)
//       return NextResponse.json(
//         { error: "Cliente no encontrado" },
//         { status: 404 }
//       );

//     return NextResponse.json({
//       message: "Cliente actualizado correctamente",
//       cliente: clienteActualizado,
//     });
//   } catch (error) {
//     console.error("Error al actualizar cliente:", error);
//     return NextResponse.json(
//       { error: "Error al actualizar el cliente" },
//       { status: 500 }
//     );
//   }
// }

// // 🗑️ Eliminar un cliente
// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await dbConnect();
//     const cliente = await Cliente.findByIdAndDelete(params.id);

//     if (!cliente)
//       return NextResponse.json(
//         { error: "Cliente no encontrado" },
//         { status: 404 }
//       );

//     return NextResponse.json({ message: "Cliente eliminado correctamente" });
//   } catch (error) {
//     console.error("Error al eliminar cliente:", error);
//     return NextResponse.json(
//       { error: "Error al eliminar el cliente" },
//       { status: 500 }
//     );
//   }
// }
