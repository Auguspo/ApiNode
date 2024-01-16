import Joi from 'joi';
import Carrito from '../models/carrito.js';

class CarritoController {
  async getCarrito(req, res) {
    try {
      const carrito = await Carrito.findOne();
      res.json(carrito || { items: [], direccionEntrega: {}, total: 0 });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  }

  async agregarAlCarrito(req, res) {
    const { items, direccionEntrega, total } = req.body;

    const productoSchema = Joi.object({
      productoId: Joi.string().required(),
      cantidad: Joi.number().integer().min(1).default(1),
    });

    const carritoSchema = Joi.object({
      items: Joi.array().items(productoSchema).required(),
      direccionEntrega: Joi.object({
        calle: Joi.string().required(),
        ciudad: Joi.string().required(),
        codigoPostal: Joi.string().required(),
      }).required(),
      total: Joi.number().required(),
    });

    try {
      const validationResult = carritoSchema.validate({ items, direccionEntrega, total });

      if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
      }

      let carrito = await Carrito.findOne();
      if (!carrito) {
        carrito = new Carrito();
      }

      carrito.items = items;
      carrito.direccionEntrega = direccionEntrega;
      carrito.total = total;

      await carrito.save();

      res.status(201).json(carrito);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar productos al carrito' });
    }
  }
}

export default new CarritoController();
