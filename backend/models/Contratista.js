import mongoose from 'mongoose';

const contratistaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  empresa: { type: String },
  especialidad: { type: String, required: true },
  telefono: { type: String },
  correo: { type: String, unique: true }
});

export default mongoose.model('Contratista', contratistaSchema);
