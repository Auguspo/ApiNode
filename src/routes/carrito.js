import express from 'express';
import carritoController from '../controllers/carritoController.js';

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
// Obtener el carrito
router.get('/', carritoController.getCarrito);

// Agregar productos al carrito
router.post('/', carritoController.agregarAlCarrito);

export default router;
