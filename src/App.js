// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel.js';
import Menu from './pages/Menu';
import MenuDetail from './components/MenuDetails.js';
import { MenuProvider } from './context/MenuContext'; // Importa el proveedor
import './index.css';

function App() {
  return (
    <Router>
      <MenuProvider>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/menu-detail" element={<MenuDetail />} /> {/* Ruta para el detalle */}
        </Routes>
      </MenuProvider>
    </Router>
  );
}

export default App;
