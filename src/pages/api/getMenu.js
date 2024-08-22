import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await sql`SELECT * FROM menu_items`;
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ error: 'Error al obtener los ítems del menú' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}