import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'DELETE') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = request.query;

  try {
    await sql`DELETE FROM menu_items WHERE id = ${id}`;
    response.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}