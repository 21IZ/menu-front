import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ nombre: '', descripcion: '', precio: '', imagen: null });
  const [editingItem, setEditingItem] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    try {
      const response = await fetch('/api/getMenu');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error al obtener los ítems del menú', error);
    }
  }

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  };

  const handleAdd = async () => {
    if (!newItem.nombre || !newItem.descripcion || !newItem.precio || !newItem.imagen) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const imageUrl = await handleImageUpload(newItem.imagen);

      const response = await fetch('/api/addMenuItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newItem, imagen: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const addedItem = await response.json();
      setMenuItems([...menuItems, addedItem]);
      setNewItem({ nombre: '', descripcion: '', precio: '', imagen: null });
      setPreviewImage('');
    } catch (error) {
      console.error('Error al agregar el ítem:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setPreviewImage(item.imagen || '');
  };

  const handleSaveEdit = async () => {
    try {
      let imageUrl = editingItem.imagen;
      if (editingItem.imagen instanceof File) {
        imageUrl = await handleImageUpload(editingItem.imagen);
      }

      const response = await fetch(`/api/updateMenuItem?id=${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editingItem, imagen: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedItem = await response.json();
      setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
      setEditingItem(null);
      setPreviewImage('');
    } catch (error) {
      console.error('Error al guardar la edición', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/deleteMenuItem?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error al eliminar el elemento', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem({ ...newItem, imagen: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className='admin'>
      <h1>Panel de Administración</h1>

      <ul className='product-list'>
        {menuItems.map(item => (
          <li key={item.id} className='product-item'>
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
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </div>
            </div>
            {item.imagen && <img src={item.imagen} alt={item.nombre} className='product-image' />}
          </li>
        ))}
      </ul>

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
              if (file) {
                setEditingItem({ ...editingItem, imagen: file });
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