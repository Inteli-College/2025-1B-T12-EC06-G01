import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Importa o contexto de autenticação

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [project, setProjectState] = useState({
    name: '',
    contractor: '',
    date: ''
  });

  // Carregar do localStorage na primeira vez
  useEffect(() => {
    const storedProject = localStorage.getItem('currentProject');
    if (storedProject) {
      setProjectState(JSON.parse(storedProject));
    }
  }, []);

  // Função customizada que salva no estado E no localStorage
  const setProject = (newProject) => {
    setProjectState(newProject);
    localStorage.setItem('currentProject', JSON.stringify(newProject));
  };
  
  // Lógica para os filtros ---
  const [contractors, setContractors] = useState([]);
  const [orderFilter, setOrderFilter] = useState('asc');
  const [contractorFilter, setContractorFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  
  const { token } = useAuth(); // Pega o token para fazer a chamada autenticada

  // useEffect para buscar a lista de contratantes para o dropdown
  useEffect(() => {
    if (token) {
      const fetchContractors = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.get('http://localhost:5000/contractors', config);
          setContractors(response.data);
        } catch (error) {
          console.error("Erro ao buscar contratantes:", error);
        }
      };
      fetchContractors();
    }
  }, [token]);

  const clearFilters = () => {
    setOrderFilter('asc');
    setContractorFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const value = {
    project,
    setProject,
    contractors,
    orderFilter,
    setOrderFilter,
    contractorFilter,
    setContractorFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    clearFilters
  };


  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}