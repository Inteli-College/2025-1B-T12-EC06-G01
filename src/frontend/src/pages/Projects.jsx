import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import NavHome from '../components/NavHome';
import { FaFolder } from "react-icons/fa6";
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext'; // NOVO: Importa o contexto

const ProjectsPage = styled.div`
  display: flex;
  flex-direction: row;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Container = styled.div`
  width: 77vw;
  margin-left: 18vw;
  padding: 2.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 2rem;
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.isLoading ? 0.5 : 1};
  pointer-events: ${props => props.isLoading ? 'none' : 'auto'};
`;

const ProjectCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-transform: capitalize;
  
  svg {
    font-size: 5rem;
    color: #969FB0;
    transition: all 0.3s ease;
  }
  
  &:hover svg {
    font-size: 6rem;
    color: #69758C;
  }
  
  p {
    margin: 0.5rem 0;
    font-weight: bold;
  }
  
  .contractor {
    font-size: 0.9rem;
    color: #666;
    font-weight: normal;
  }
`;

const LoadingMessage = styled.h2`
  grid-column: span 6;
  text-align: center;
  color: #666;
`;

const ErrorMessage = styled.h2`
  grid-column: span 6;
  text-align: center;
  color: #d32f2f;
`;

const AddButton = styled.button`
  height: 70%;
  border: 3px solid #0A3B4E;
  border-radius: 15px;
  background-color: #629EBC;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #3D80A3;
  }
`;

export default function Projects() {
  const { isLoadingAuth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // O estado de erro agora guardará uma string amigável
  const [error, setError] = useState('');
  const { 
    contractorFilter, 
    orderFilter,
    startDateFilter,
    endDateFilter
  } = useProject();

  const { token } = useAuth(); // Pega o token para autenticação

  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const params = new URLSearchParams();
        // Adiciona os filtros à query apenas se eles tiverem um valor
        if (contractorFilter) params.append('contractor', contractorFilter);
        if (startDateFilter) params.append('start_date', startDateFilter);
        if (endDateFilter) params.append('end_date', endDateFilter);
        // O filtro de ordem sempre terá um valor ('asc' ou 'desc')
        params.append('order', orderFilter);
        
        const queryString = params.toString();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const response = await axios.get(`http://localhost:5000/projects/?${queryString}`, config);
        setProjects(response.data);
    
      } catch (err) {
        console.error('Erro detalhado ao buscar projetos:', err.response); // Mantém o log técnico para o dev

        // Lógica de tratamento de erro aprimorada ---
        let errorMessage = 'Não foi possível carregar os projetos. Tente novamente mais tarde.';

        // Verifica se a resposta do nosso backend contém a mensagem customizada
        if (err.response && err.response.data && err.response.data.message) {
          // Se sim, usa a mensagem amigável que definimos no backend!
          errorMessage = err.response.data.message;
        }
        
        setError(errorMessage); // Define a mensagem de erro para ser exibida na tela
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [token, contractorFilter, orderFilter, startDateFilter, endDateFilter]);

  // Você pode usar os estados para renderizar a UI:
  // if (isLoading) {
  //   return <p>Carregando projetos...</p>;
  // }

  if (error) {
    return <p style={{ color: 'red' }}>Erro: {error}</p>;
  }


  return (
    <ProjectsPage>
      <Sidebar />
      <Body>
        <NavHome />
        
        <Container isLoading={isLoading}>
          {isLoading && <LoadingMessage>Carregando projetos...</LoadingMessage>}
          {error && <ErrorMessage>Erro ao carregar projetos: {error.message}</ErrorMessage>}
          
          {!isLoading && !error && projects.length === 0 && (
            <LoadingMessage>Nenhum projeto encontrado.</LoadingMessage>
          )}
          
          {!isLoading && !error && projects.length > 0 && projects.map((project) => (
            <ProjectCard key={project.id} to={`/project/${project.id}/predios`}>
              <FaFolder />
              <p>{project.name}</p>
              <p className="contractor">{project.contractor}</p>
            </ProjectCard>
          ))}
          
          
        </Container>
      </Body>
    </ProjectsPage>
  );
}
