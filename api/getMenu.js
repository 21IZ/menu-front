import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    const result = await sql`SELECT * FROM menu_items`;
    response.status(200).json(result.rows);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}