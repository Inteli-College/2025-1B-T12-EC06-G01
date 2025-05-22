import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NavHome from '../components/NavHome';
import styled from 'styled-components';
import FoldersSection from '../components/FoldersSection';
import axios from 'axios'; // Import axios

const Homepage = styled.div`
  display: flex;
  flex-direction: row;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Home() {
  // State to store the fetched building names
  const [buildingNames, setBuildingNames] = useState([]);
  // Optional: State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch buildings when the component mounts
  useEffect(() => {
    const fetchBuildings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/building/');
        // Assuming the backend returns an array of building objects
        // and each object has a 'predio' field for the name
        // and an 'id' field.
        if (response.data && Array.isArray(response.data)) {
          // We'll pass an array of objects to FoldersSection to use 'id' for keys
          // and 'predio' for the name.
          setBuildingNames(response.data);
        } else {
          console.error("Formato de resposta inesperado:", response.data);
          setBuildingNames([]); // Fallback to empty array
        }
      } catch (err) {
        console.error("Erro ao buscar prédios:", err);
        setError(err);
        setBuildingNames([]); // Fallback in case of error
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  if (isLoading) {
    // Optional: Render a loading indicator
    // return <Homepage><Sidebar /><Body><NavHome /><div>Carregando prédios...</div></Body></Homepage>;
  }

  if (error) {
    // Optional: Render an error message
    // return <Homepage><Sidebar /><Body><NavHome /><div>Erro ao carregar dados: {error.message}</div></Body></Homepage>;
  }

  return (
    <Homepage>
      <Sidebar />
      <Body>
        <NavHome />
        {/* Pass the fetched building data to FoldersSection */}
        {/* FoldersSection will expect an array of objects like { id: 1, predio: "Nome" } */}
        <FoldersSection folders={buildingNames} path="/predio" />
      </Body>
    </Homepage>
  );
}