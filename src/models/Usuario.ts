import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUsuario extends mongoose.Document {
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const UsuarioSchema = new mongoose.Schema<IUsuario>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// 🔒 Encriptar password antes de guardar
UsuarioSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔐 Método para comparar contraseñas
UsuarioSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

// ✅ Usa modelo existente si ya fue declarado (Next.js HMR fix)
const Usuario =
  mongoose.models.Usuario || mongoose.model<IUsuario>("Usuario", UsuarioSchema);
export default Usuario;



// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UsuarioSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true },
// });

// // Encriptar la contraseña antes de guardar
// UsuarioSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Método para comparar contraseñas
// UsuarioSchema.methods.comparePassword = function(password) {
//   return bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model('Usuario', UsuarioSchema);
