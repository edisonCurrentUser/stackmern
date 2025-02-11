import express from 'express';
import Inspeccion from '../models/Inspeccion.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const inspecciones = await Inspeccion.find().populate('proyecto');
    res.json(inspecciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevaInspeccion = new Inspeccion(req.body);
    const inspeccionGuardada = await nuevaInspeccion.save();
    res.status(201).json(inspeccionGuardada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const inspeccion = await Inspeccion.findById(req.params.id).populate('proyecto');
    if (!inspeccion) return res.status(404).json({ message: 'Inspección no encontrada' });
    res.json(inspeccion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const inspeccionActualizada = await Inspeccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(inspeccionActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Inspeccion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inspección eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
