import mongoose from 'mongoose';

const certificadoSchema = new mongoose.Schema({
  numeroCertificado: { type: String, required: true, unique: true },
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', required: true },
  fechaEmision: { type: Date, default: Date.now },
  descripcion: { type: String },
  estado: { type: String, enum: ['Pendiente', 'Aprobado', 'Rechazado'], default: 'Pendiente' }
});

export default mongoose.model('Certificado', certificadoSchema);
