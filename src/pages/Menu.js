import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { getMenuItems } from '../utils/storage';
import '../index.css';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log('KV_REST_API_URL:', process.env.KV_REST_API_URL);
  console.log('KV_REST_API_TOKEN:', process.env.KV_REST_API_TOKEN);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true);
        const data = await getMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching the menu items', error);
        setError('Error al cargar el menú. Llama a +5354547503');
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="menu">
      <h1>Menú</h1>
      <div className="menu-items">
        {menuItems.map(item => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Menu;