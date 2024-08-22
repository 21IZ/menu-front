import { sql } from '@vercel/postgres';

   export default async function handler(request, response) {
     // Configurar headers CORS
     response.setHeader('Access-Control-Allow-Credentials', true);
     response.setHeader('Access-Control-Allow-Origin', '*');
     response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
     response.setHeader(
       'Access-Control-Allow-Headers',
       'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
     );

     if (request.method === 'OPTIONS') {
       response.status(200).end();
       return;
     }

     try {
       const result = await sql`SELECT * FROM menu_items`;
       response.status(200).json(result.rows);
     } catch (error) {
       console.error('Error fetching menu items:', error);
       response.status(500).json({ error: 'Error al obtener los ítems del menú' });
     }
   }