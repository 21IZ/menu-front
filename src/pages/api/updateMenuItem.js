import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'PUT') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = request.query;
  const { nombre, descripcion, precio, imagen } = JSON.parse(request.body);

  try {
    const result = await sql`
      UPDATE menu_items
      SET nombre = ${nombre}, descripcion = ${descripcion}, precio = ${precio}, imagen = ${imagen}
      WHERE id = ${id}
      RETURNING *;
    `;
    response.status(200).json(result.rows[0]);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}