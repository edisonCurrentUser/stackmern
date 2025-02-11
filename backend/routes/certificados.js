import express from 'express';
import Certificado from '../models/Certificado.js';

const router = express.Router();

// Obtener todos los certificados
router.get('/', async (req, res) => {
  try {
    const certificados = await Certificado.find().populate('proyecto');
    res.json(certificados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo certificado
router.post('/', async (req, res) => {
  try {
    const nuevoCertificado = new Certificado(req.body);
    const certificadoGuardado = await nuevoCertificado.save();
    res.status(201).json(certificadoGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener un certificado por ID
router.get('/:id', async (req, res) => {
  try {
    const certificado = await Certificado.findById(req.params.id).populate('proyecto');
    if (!certificado) return res.status(404).json({ message: 'Certificado no encontrado' });
    res.json(certificado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un certificado por ID
router.put('/:id', async (req, res) => {
  try {
    const certificadoActualizado = await Certificado.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(certificadoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un certificado por ID
router.delete('/:id', async (req, res) => {
  try {
    await Certificado.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificado eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
