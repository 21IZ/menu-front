import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  const { nombre, descripcion, precio, imagen } = JSON.parse(request.body);

  try {
    const result = await sql`
      INSERT INTO menu_items (nombre, descripcion, precio, imagen)
      VALUES (${nombre}, ${descripcion}, ${precio}, ${imagen})
      RETURNING *;
    `;
    response.status(200).json(result.rows[0]);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}