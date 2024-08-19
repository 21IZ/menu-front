import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import '../index.css';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/menu`);
        console.log('Received menu items:', response.data);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching the menu items', error);
        setError('Error al cargar el menú. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, [API_URL]);

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