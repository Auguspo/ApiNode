import express from 'express';
import carritoController from '../controllers/carritoController.js';

const router = express.Router();


router.get('/', carritoController.getCarrito);
router.post('/', carritoController.agregarAlCarrito);
router.delete('/', carritoController.vaciarCarrito); 
router.delete('/:id', carritoController.eliminarProductoDelCarrito);

export default router;
