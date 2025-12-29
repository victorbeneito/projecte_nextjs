import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Pedido from "@/models/Pedido";
import Cliente from "@/models/Cliente";
import Cupon from "@/models/Cupon";
import { verifyToken } from "@/lib/verifyToken";

/**
 * Crea un pedido real en MongoDB desde el checkout
 * Recibe: { carrito, metodoEnvio, metodoPago, descuento, totalFinal, cuponCodigo }
 */
export async function POST(req: Request) {
  try {
    // 1️⃣ Conexión a la base de datos
    await dbConnect();

    // 2️⃣ Verificamos el token del CLIENTE
    const verified = await verifyToken(req, "cliente");
    if (verified instanceof Response) return verified; // devuelve error 401/403 si falla

    const clienteId = verified.id; // tomado del token

    // 3️⃣ Leemos el cuerpo del request
    const body = await req.json();
    const {
      carrito,
      metodoEnvio,
      metodoPago,
      descuento,
      totalFinal,
      cuponCodigo,
    } = body;

    if (!carrito || carrito.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    // 4️⃣ Buscamos al cliente
    const cliente = await Cliente.findById(clienteId);
    if (!cliente)
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );

    // 5️⃣ Marcamos el cupón como usado (si existe)
    let cuponUsado = null;
    if (cuponCodigo) {
      cuponUsado = await Cupon.findOneAndUpdate(
        { codigo: cuponCodigo.toUpperCase() },
        { usado: true },
        { new: true }
      );
      // guardamos usuario en lista de clientesUsados
      await Cupon.updateOne(
        { codigo: cuponCodigo.toUpperCase() },
        { $addToSet: { clientesUsados: clienteId } }
      );
    }

    // 6️⃣ Creamos un nuevo pedido
    const nuevoPedido = new Pedido({
      clienteId: cliente._id,
      cliente: {
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        ciudad: cliente.ciudad,
        cp: cliente.cp,
      },
      envio: metodoEnvio,
      pago: metodoPago,
      productos: carrito.map((p: any) => ({
        productoId: p._id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precioUnitario: p.precioFinal ?? p.precio,
        subtotal: (p.precioFinal ?? p.precio) * p.cantidad,
      })),
      estado: "pendiente",
      fechaPedido: new Date(),
      numeroPedido: "", // se rellena con pre('save') en el modelo
      cupon: cuponUsado
        ? { codigo: cuponUsado.codigo, descuento: cuponUsado.descuento }
        : undefined,
      totalFinal,
      descuento,
    });

    // 7️⃣ Guardamos el pedido
    await nuevoPedido.save();

    console.log("✅ Pedido creado:", nuevoPedido._id);

    return NextResponse.json({
      message: "Pedido creado correctamente",
      pedido: nuevoPedido,
    });
  } catch (error: any) {
    console.error("❌ Error al crear pedido:", error.message || error);
    return NextResponse.json(
      { error: "Error al crear pedido", detalle: error.message || error },
      { status: 500 }
    );
  }
}



// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import dbConnect from "@/lib/mongoose";
// import Pedido from "@/models/Pedido";
// import Cliente from "@/models/Cliente";
// import Cupon from "@/models/Cupon";
// import { verifyToken } from "@/lib/verifyToken";

// /**
//  * Crea un pedido real en MongoDB desde el checkout
//  * Recibe: { carrito, metodoEnvio, metodoPago, descuento, totalFinal, cuponCodigo }
//  */
// export async function POST(req: Request) {

//     const verified = await verifyToken(req, 'cliente');
//   if (verified instanceof Response) return verified; // Si hay error 403/401 lo devuelve directo

//   const usuarioId = verified.id; // cliente autenticado
//   try {
//     // 1️⃣ Conexión a la base de datos
//     await dbConnect();

//     // 2️⃣ Verificamos el token de autenticación
//     const header = req.headers.get("authorization");
//     const token = header?.split(" ")[1];
//     if (!token)
//       return NextResponse.json({ error: "Token requerido" }, { status: 401 });

//     if (!process.env.SECRETO_JWT)
//       throw new Error("Falta SECRETO_JWT en variables de entorno (.env)");

//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, process.env.SECRETO_JWT);
//     } catch (err) {
//       console.error("❌ Token inválido:", err);
//       return NextResponse.json({ error: "Token inválido" }, { status: 403 });
//     }

//     if (typeof decoded === "string" || !decoded.id) {
//       return NextResponse.json({ error: "Token malformado" }, { status: 403 });
//     }

//     // 3️⃣ Leemos el cuerpo del request
//     const body = await req.json();
//     const {
//       carrito,
//       metodoEnvio,
//       metodoPago,
//       descuento,
//       totalFinal,
//       cuponCodigo,
//     } = body;

//     if (!carrito || carrito.length === 0) {
//       return NextResponse.json(
//         { error: "El carrito está vacío" },
//         { status: 400 }
//       );
//     }

//     // 4️⃣ Buscamos al cliente
//     const cliente = await Cliente.findById(decoded.id);
//     if (!cliente)
//       return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

//     // 5️⃣ Marcamos el cupón como usado (si existe)
//     let cuponUsado = null;
//     if (cuponCodigo) {
//       cuponUsado = await Cupon.findOneAndUpdate(
//         { codigo: cuponCodigo.toUpperCase() },
//         { usado: true },
//         { new: true }
//       );
//       // Guardamos usuario en lista de clientesUsados
//       await Cupon.updateOne(
//         { codigo: cuponCodigo.toUpperCase() },
//         { $addToSet: { clientesUsados: decoded.id } }
//       );
//     }

//     // 6️⃣ Creamos un nuevo pedido
//     const nuevoPedido = new Pedido({
//       clienteId: cliente._id,
//       cliente: {
//         nombre: cliente.nombre,
//         email: cliente.email,
//         telefono: cliente.telefono,
//         direccion: cliente.direccion,
//         ciudad: cliente.ciudad,
//         cp: cliente.cp,
//       },
//       envio: metodoEnvio,
//       pago: metodoPago,
//       productos: carrito.map((p: any) => ({
//         productoId: p._id,
//         nombre: p.nombre,
//         cantidad: p.cantidad,
//         precioUnitario: p.precioFinal ?? p.precio,
//         subtotal: (p.precioFinal ?? p.precio) * p.cantidad,
//       })),
//       estado: "pendiente",
//       fechaPedido: new Date(),
//       numeroPedido: "", // se rellena con pre('save')
//       cupon: cuponUsado
//         ? { codigo: cuponUsado.codigo, descuento: cuponUsado.descuento }
//         : undefined,
//       totalFinal,
//       descuento,
//     });

//     // 7️⃣ Guardamos el pedido
//     await nuevoPedido.save();

//     console.log("✅ Pedido creado:", nuevoPedido._id);

//     return NextResponse.json({
//       message: "Pedido creado correctamente",
//       pedido: nuevoPedido,
//     });
//   } catch (error: any) {
//     console.error("❌ Error al crear pedido:", error.message || error);
//     return NextResponse.json(
//       { error: "Error al crear pedido", detalle: error.message || error },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import dbConnect from "@/lib/mongoose";
// import Pedido from "@/models/Pedido";
// import Cliente from "@/models/Cliente";
// import Cupon from "@/models/Cupon";

// /**
//  * Crea un pedido real en MongoDB desde el checkout
//  * Recibe: { carrito, metodoEnvio, metodoPago, descuento, totalFinal, cupón }
//  */
// export async function POST(req: Request) {
//   try {
//     await dbConnect();

//     // 1️⃣  Verificamos el token del usuario
//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token)
//       return NextResponse.json({ error: "Token requerido" }, { status: 401 });

//     const decoded = jwt.verify(token, process.env.SECRETO_JWT!);
//     if (typeof decoded === "string" || !decoded.id)
//       return NextResponse.json({ error: "Token inválido" }, { status: 403 });

//     // 2️⃣  Leemos datos del cuerpo del POST
//     const body = await req.json();
//     const { carrito, metodoEnvio, metodoPago, descuento, totalFinal, cuponCodigo } = body;

//     if (!carrito || carrito.length === 0)
//       return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });

//     // 3️⃣  Buscamos al cliente
//     const cliente = await Cliente.findById(decoded.id);
//     if (!cliente)
//       return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

//     // 4️⃣  Marcamos el cupón como usado (si existe)
//     let cuponUsado = null;
//     if (cuponCodigo) {
//       cuponUsado = await Cupon.findOneAndUpdate(
//         { codigo: cuponCodigo.toUpperCase() },
//         { usado: true },
//         { new: true }
//       );
//     }

//     // 5️⃣  Creamos el pedido
//     const nuevoPedido = new Pedido({
//       clienteId: cliente._id,
//       cliente: {
//         nombre: cliente.nombre,
//         email: cliente.email,
//         telefono: cliente.telefono,
//         direccion: cliente.direccion,
//         ciudad: cliente.ciudad,
//         cp: cliente.cp,
//       },
//       envio: metodoEnvio,
//       pago: metodoPago,
//       productos: carrito.map((p: any) => ({
//         productoId: p._id,
//         nombre: p.nombre,
//         cantidad: p.cantidad,
//         precioUnitario: p.precioFinal ?? p.precio,
//         subtotal: (p.precioFinal ?? p.precio) * p.cantidad,
//       })),
//       estado: "pendiente",
//       fechaPedido: new Date(),
//       numeroPedido: "", // se rellena automáticamente en el middleware pre("save")
//       cupon: cuponUsado
//         ? { codigo: cuponUsado.codigo, descuento: cuponUsado.descuento }
//         : undefined,
//       totalFinal,
//       descuento,
//     });

//     if (body.cuponCodigo) {
//   await Cupon.updateOne(
//     { codigo: body.cuponCodigo },
//     { $addToSet: { clientesUsados: decoded.id } } // evita duplicados
//   );
// }


//     await nuevoPedido.save();

//     return NextResponse.json({
//       message: "Pedido creado correctamente",
//       pedido: nuevoPedido,
//     });
//   } catch (error) {
//     console.error("❌ Error creando pedido:", error);
//     return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 });
//   }

// }
