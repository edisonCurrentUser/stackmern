import express from 'express';
import Proyecto from '../models/Proyecto.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const proyectos = await Proyecto.find().populate('contratistas inspecciones');
    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevoProyecto = new Proyecto(req.body);
    const proyectoGuardado = await nuevoProyecto.save();
    res.status(201).json(proyectoGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id).populate('contratistas inspecciones');
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const proyectoActualizado = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(proyectoActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Proyecto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
