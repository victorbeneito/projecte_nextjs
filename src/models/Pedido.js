const mongoose = require('mongoose');

const pedidoProductoSchema = new mongoose.Schema({
  producto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
  nombre: String,
  cantidad: Number,
  precio_unitario: Number,
  total: Number
});

const pedidoSchema = new mongoose.Schema({
  cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  fecha: { type: Date, default: Date.now },
  estado: String,
  productos: [pedidoProductoSchema]
});

module.exports = mongoose.model('Pedido', pedidoSchema);
