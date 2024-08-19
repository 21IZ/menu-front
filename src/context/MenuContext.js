// src/context/MenuContext.js
import React, { createContext, useState, useContext } from 'react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <MenuContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => useContext(MenuContext);
