import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuContext } from '../context/MenuContext';

function MenuDetail() {
  const { selectedItem } = useMenuContext();
  const navigate = useNavigate();

  if (!selectedItem) return <div>No item selected</div>;

  const { image, title, price, description } = selectedItem;

  return (
    <div className="menu-detail">
      <img src={image} alt={title} className="menu-detail-image" />
      <h1 className="menu-detail-title">{title}</h1>
      <p className="menu-detail-price" style={{ color: 'red' }}>${price}</p>
      <p className="menu-detail-description">{description}</p>
      <button onClick={() => navigate('/menu')}>Volver al Menú</button>
    </div>
  );
}

export default MenuDetail;