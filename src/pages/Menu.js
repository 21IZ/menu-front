import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import '../index.css';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true);
        const response = await fetch('/api/getMenu.js');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching the menu items', error);
        setError('Error al cargar el menú. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="menu-container">
      <h1>Menú</h1>
      <div className="menu-grid">
        {menuItems.map(item => (
          <Card
            key={item._id}
            image={item.imagen}
            title={item.nombre}
            price={item.precio}
            description={item.descripcion}
            id={item._id}
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;