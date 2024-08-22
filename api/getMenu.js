export default function handler(req, res) {
  res.status(200).json([{ id: 1, nombre: 'Prueba', precio: 10, descripcion: 'Ítem de prueba' }]);
}