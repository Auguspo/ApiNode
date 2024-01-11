import Joi from 'joi';
import Carrito from '../models/carrito.js';


class CarritoController {
  async getCarrito(req, res) {
    try {
      const carrito = await Carrito.findOne();
      res.json(carrito || { items: [] });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  }

  async agregarAlCarrito(req, res) {
    const { productos } = req.body;

    // Definir un esquema de validación usando Joi
    const productoSchema = Joi.object({
      productoId: Joi.string().required(),
      cantidad: Joi.number().integer().min(1).default(1),
    });

    const carritoSchema = Joi.array().items(productoSchema);

    try {
      // Validar los productos con el esquema definido
      const validationResult = carritoSchema.validate(productos);

      if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
      }

      // Obtener el carrito actual o crear uno nuevo si no existe
      let carrito = await Carrito.findOne();
      if (!carrito) {
        carrito = new Carrito();
      }

      // Agregar los productos al carrito
      carrito.items.push(...productos);

      // Guardar el carrito en la base de datos
      await carrito.save();

      res.status(201).json(carrito);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar productos al carrito' });
    }
  }

  async vaciarCarrito(req, res) {
    try {
      // Vaciar el carrito eliminando todos los productos
      const carritoVaciado = await Carrito.findOneAndDelete();

      if (carritoVaciado) {
        res.json(carritoVaciado);
      } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
  }

  async eliminarProductoDelCarrito(req, res) {
    const { id } = req.params;

    try {
      // Encontrar y eliminar el producto del carrito por su ID
      const carrito = await Carrito.findOne();
      if (carrito) {
        const index = carrito.items.findIndex((item) => item.productoId === id);

        if (index !== -1) {
          carrito.items.splice(index, 1);
          await carrito.save();
          res.json(carrito);
        } else {
          res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
      } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
  }

}

export default new CarritoController();
