import mongoose from 'mongoose';

const proyectoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ubicacion: { type: String },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date },
  contratistas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contratista' }],
  inspecciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inspeccion' }]
});

export default mongoose.model('Proyecto', proyectoSchema);
