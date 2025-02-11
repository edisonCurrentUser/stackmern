import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar modelos
import certificadosRoutes from './routes/certificados.js';
import proyectosRoutes from './routes/proyectos.js';
import inspeccionesRoutes from './routes/inspecciones.js';
import contratistasRoutes from './routes/contratistas.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// Rutas
app.use('/api/certificados', certificadosRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/inspecciones', inspeccionesRoutes);
app.use('/api/contratistas', contratistasRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
