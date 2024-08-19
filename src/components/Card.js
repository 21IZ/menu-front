import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuContext } from '../context/MenuContext';

const Card = ({ image, title, price, description, id }) => {
  const navigate = useNavigate();
  const { setSelectedItem } = useMenuContext();

  const handleClick = () => {
    setSelectedItem({ image, title, price, description, id });
    navigate(`/menu-detail/${id}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      {image && (
        <img 
          src={image} 
          alt={title} 
          className="card-image" 
          onError={(e) => {
            console.error('Image failed to load:', image);
            e.target.src = 'https://github.com/21IZ/img-stock/blob/main/corte1.png?raw=true'; // Reemplaza con una imagen de respaldo real
          }}
        />
      )}
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-price">${price}</p>
      </div>
    </div>
  );
};

export default Card;