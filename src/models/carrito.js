import mongoose from 'mongoose';

const carritoItemSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, default: 1 },
});

const carritoSchema = new mongoose.Schema({
  items: [carritoItemSchema],
});

const Carrito = mongoose.model('Carrito', carritoSchema);

export default Carrito;
