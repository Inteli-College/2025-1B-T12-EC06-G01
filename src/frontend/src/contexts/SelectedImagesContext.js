import React, { createContext, useContext, useState } from 'react';

const SelectedImagesContext = createContext();

export function SelectedImagesProvider({ children }) {
  const [selectedImages, setSelectedImages] = useState([]);
  return (
    <SelectedImagesContext.Provider value={{ selectedImages, setSelectedImages }}>
      {children}
    </SelectedImagesContext.Provider>
  );
}

export function useSelectedImages() {
  return useContext(SelectedImagesContext);
}
