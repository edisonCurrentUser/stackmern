import mongoose from 'mongoose';

const inspeccionSchema = new mongoose.Schema({
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true },
  fecha: { type: Date, required: true },
  inspector: { type: String, required: true },
  observaciones: { type: String },
  estado: { type: String, enum: ['Pendiente', 'Aprobada', 'Rechazada'], default: 'Pendiente' }
});

export default mongoose.model('Inspeccion', inspeccionSchema);
