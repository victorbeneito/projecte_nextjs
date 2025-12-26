import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true }
});

const Categoria =module.exports || mongoose.model('Categoria', categoriaSchema);

export default Categoria;
