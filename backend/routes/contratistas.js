import express from 'express';
import Contratista from '../models/Contratista.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contratistas = await Contratista.find();
    res.json(contratistas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevoContratista = new Contratista(req.body);
    const contratistaGuardado = await nuevoContratista.save();
    res.status(201).json(contratistaGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contratista = await Contratista.findById(req.params.id);
    if (!contratista) return res.status(404).json({ message: 'Contratista no encontrado' });
    res.json(contratista);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const contratistaActualizado = await Contratista.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(contratistaActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Contratista.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contratista eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
