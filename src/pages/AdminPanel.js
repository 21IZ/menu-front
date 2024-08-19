import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Asume que has configurado esta variable de entorno en Vercel
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminPanel() {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ nombre: '', descripcion: '', precio: '', imagen: null });
  const [editingItem, setEditingItem] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [originalImage, setOriginalImage] = useState('');

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await axios.get(`${API_URL}/api/menu`);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error al obtener los ítems del menú', error);
      }
    }
    fetchMenuItems();
  }, []);

  const handleAdd = async () => {
    if (!newItem.nombre || !newItem.descripcion || !newItem.precio) {
      alert('Por favor completa todos los campos');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', newItem.nombre);
    formData.append('descripcion', newItem.descripcion);
    formData.append('precio', newItem.precio);
    if (newItem.imagen) formData.append('imagen', newItem.imagen);

    try {
      const response = await axios.post(`${API_URL}/api/menu`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMenuItems([...menuItems, response.data]);
      setNewItem({ nombre: '', descripcion: '', precio: '', imagen: null });
      setPreviewImage(''); // Limpiar la vista previa
    } catch (error) {
      console.error('Error al agregar el ítem:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setPreviewImage(item.imagen ? `http://localhost:5000${item.imagen}` : '');
    setOriginalImage(item.imagen ? `http://localhost:5000${item.imagen}` : '');
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append('nombre', editingItem.nombre);
    formData.append('descripcion', editingItem.descripcion);
    formData.append('precio', editingItem.precio);
  
    if (editingItem.imagen instanceof File) {
      // Si hay una nueva imagen seleccionada, añadirla al FormData
      formData.append('imagen', editingItem.imagen);
      console.log("se selecciono una");
    } else {
      // Si no hay nueva imagen, enviar la URL de la imagen original
      formData.append('imagen', originalImage); // `originalImage` debe ser la URL de la imagen original
      console.log("NO se selecciono una");
      console.log(originalImage);
    }
  
    try {
      const response = await axios.put(`${API_URL}/api/menu/${editingItem._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMenuItems(menuItems.map(item => item._id === editingItem._id ? response.data : item));
      setEditingItem(null);
      setPreviewImage(''); // Limpiar la vista previa
    } catch (error) {
      console.error('Error al guardar la edición', error);
    }
  };
  
  
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/menu/${id}`);
      setMenuItems(menuItems.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error al eliminar el elemento', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewItem({ ...newItem, imagen: file });
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className='admin'>
      <h1>Panel de Administración</h1>

      <ul className='product-list'>
        {menuItems.map(item => (
          <li key={item._id} className='product-item'>
            <div className='product-info'>
              <span className='product-name'>{item.nombre}</span>
              <br />
              <span className='product-price'>${item.precio}</span>
              <br />
              <span className='product-description'>
                {item.descripcion.length > 50 ? `${item.descripcion.substring(0, 20)}...` : item.descripcion}
              </span>
              <div className='product-buttons'>
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item._id)}>Eliminar</button>
              </div>
            </div>
            {item.imagen && <img src={`http://localhost:5000${item.imagen}`} alt={item.nombre} className='product-image' />}
          </li>
        ))}
      </ul>

      {/* Sección para editar ítem */}
      {editingItem && (
        <div className="admin-edit">
          <h2>Editar Oferta</h2>
          <input
            type="text"
            value={editingItem.nombre}
            onChange={(e) => setEditingItem({ ...editingItem, nombre: e.target.value })}
            className="admin-edit-input"
          />
          <input
            type="text"
            value={editingItem.descripcion}
            onChange={(e) => setEditingItem({ ...editingItem, descripcion: e.target.value })}
            className="admin-edit-input"
          />
          <input
            type="number"
            value={editingItem.precio}
            onChange={(e) => setEditingItem({ ...editingItem, precio: e.target.value })}
            className="admin-edit-input"
          />
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              setEditingItem({ ...editingItem, imagen: file });
              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              }
            }}
            accept="image/*"
            className="admin-edit-file-input"
          />
          {previewImage && <img src={previewImage} alt="Vista previa" className="admin-preview-image" />}
          <button onClick={handleSaveEdit} className="admin-edit-button">Guardar</button>
        </div>
      )}

      {/* Sección para agregar nuevo ítem */}
      <div className="admin-add">
        <h2>Agregar <br />Nuevo Ítem</h2>
        <input
          type="text"
          value={newItem.nombre}
          onChange={(e) => setNewItem({ ...newItem, nombre: e.target.value })}
          placeholder="Nombre"
          className="admin-add-input"
        />
        <input
          type="text"
          value={newItem.descripcion}
          onChange={(e) => setNewItem({ ...newItem, descripcion: e.target.value })}
          placeholder="Descripción"
          className="admin-add-input"
        />
        <input
          type="number"
          value={newItem.precio}
          onChange={(e) => setNewItem({ ...newItem, precio: e.target.value })}
          placeholder="Precio"
          className="admin-add-input"
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="admin-add-file-input"
        />
        {previewImage && <img src={previewImage} alt="Vista previa" className="admin-preview-image" />}
        <button onClick={handleAdd} className="admin-add-button">Agregar</button>
      </div>
    </div>
  );
}

export default AdminPanel;
