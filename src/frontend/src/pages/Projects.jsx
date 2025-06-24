import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import NavHome from '../components/NavHome';
import { FaFolder } from "react-icons/fa6";

const ProjectsPage = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;

const Container = styled.div`
  width: calc(100vw - var(--sidebar-width, 280px));
  margin-left: var(--sidebar-width, 280px);
  padding: var(--spacing-xl) var(--spacing-2xl, 3.5rem);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    margin-left: 0;
    width: 100vw;
    padding: var(--spacing-md);
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }

  @media (min-width: 481px) and (max-width: 768px) {
    margin-left: 200px;
    width: calc(100vw - 200px);
    padding: var(--spacing-lg);
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  @media (min-width: 1441px) {
    margin-left: 320px;
    width: calc(100vw - 320px);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
    padding: var(--spacing-xl) var(--spacing-3xl, 5rem);
  }
`;

const ProjectCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-transform: capitalize;
  padding: var(--spacing-md);
  border-radius: 15px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  border: 2px solid transparent;
  
  &:hover {
    background-color: #e9ecef;
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    font-size: 4rem;
    color: #969FB0;
    transition: all 0.3s ease;
    margin-bottom: var(--spacing-sm);
  }
  
  &:hover svg {
    font-size: 4.5rem;
    color: #69758C;
  }
  
  p {
    margin: var(--spacing-xs) 0;
    font-weight: bold;
    font-size: var(--font-size-base);
    color: var(--text-color);
  }
  
  .contractor {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    font-weight: normal;
  }

  @media (max-width: 768px) {
    padding: var(--spacing-sm);
    
    svg {
      font-size: 3rem;
    }
    
    &:hover svg {
      font-size: 3.5rem;
    }
    
    p {
      font-size: var(--font-size-sm);
    }
    
    .contractor {
      font-size: var(--font-size-xs);
    }
  }

  @media (min-width: 1441px) {
    padding: var(--spacing-lg);
    
    svg {
      font-size: 5rem;
    }
    
    &:hover svg {
      font-size: 5.5rem;
    }
    
    p {
      font-size: var(--font-size-lg);
    }
    
    .contractor {
      font-size: var(--font-size-base);
    }
  }
`;

const LoadingMessage = styled.h2`
  grid-column: 1 / -1;
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-size-xl);
  padding: var(--spacing-xl);
`;

const ErrorMessage = styled.h2`
  grid-column: 1 / -1;
  text-align: center;
  color: #d32f2f;
  font-size: var(--font-size-xl);
  padding: var(--spacing-xl);
`;

const AddButton = styled.button`
  height: 100%;
  min-height: 120px;
  border: 3px solid var(--secondary-color);
  border-radius: 15px;
  background-color: var(--primary-color);
  color: #fff;
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  
  &:hover {
    background-color: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    min-height: 100px;
    font-size: var(--font-size-base);
    padding: var(--spacing-sm);
  }

  @media (min-width: 1441px) {
    min-height: 150px;
    font-size: var(--font-size-xl);
    padding: var(--spacing-lg);
  }
`;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // A resposta da API já é um array de projetos no formato correto
        const response = await axios.get('http://localhost:5000/projects');
        
        // A response.data já é o array que queremos, não precisa de conversão!
        setProjects(response.data);
    
      } catch (err) {
        console.error('Erro ao buscar projetos:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <ProjectsPage>
      <Sidebar />
      <Body>
        <NavHome />
        
        <Container>
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
