import React, { useState } from 'react'
import styled from 'styled-components'
import { IoIosAdd } from "react-icons/io"
import { FaRegUserCircle, FaFolder } from "react-icons/fa"
import { IoExitOutline } from "react-icons/io5"
import logo from '../logo.svg'
import { useProject } from '../contexts/ProjectContext'
import { useNavigate, Link } from 'react-router-dom';
import NovoProjetoPopup from './NovoProjetoPopup'
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  width: var(--sidebar-width, 280px);
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--background-color);
  box-shadow: 2px 0px 12px 2px rgba(0, 0, 0, 0.25);
  z-index: 1000;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0 var(--spacing-xl) 0;
  box-sizing: border-box;

  /* Mobile: esconder sidebar */
  @media (max-width: 480px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
    padding: var(--spacing-sm) 0 var(--spacing-lg) 0;
  }

  /* Tablet: ajustar tamanhos */
  @media (min-width: 481px) and (max-width: 768px) {
    width: 200px;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) 0 var(--spacing-lg) 0;
  }

  /* Desktop: ajustar para telas maiores */
  @media (min-width: 1441px) {
    width: 320px;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg) 0 var(--spacing-2xl, 3.5rem) 0;
  }
`

const Logo = styled.img`
  width: 30%;
  max-width: 80px;
  height: auto;
  margin-top: var(--spacing-md);

  @media (max-width: 768px) {
    width: 40%;
    max-width: 60px;
  }

  @media (min-width: 1441px) {
    width: 25%;
    max-width: 100px;
  }
`

const BntMaior = styled.button`
  width: 80%;
  min-height: 120px;
  max-height: 150px;
  border-radius: 20px;
  background-color: var(--primary-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 5px solid var(--text-color);
  padding: var(--spacing-sm);
  transition: all 0.3s ease; 

  &:hover {
    background-color: var(--primary-hover); 
    cursor: pointer; 
  }

  span {
    font-size: var(--font-size-lg);
    color: #fff;
    text-align: center;
    margin-bottom: var(--spacing-xs);
  }

  svg {
    font-size: 3rem;
    color: #fff;
  }

  @media (max-width: 768px) {
    min-height: 100px;
    padding: var(--spacing-xs);
    
    span {
      font-size: var(--font-size-base);
    }
    
    svg {
      font-size: 2.5rem;
    }
  }

  @media (min-width: 1441px) {
    min-height: 150px;
    
    span {
      font-size: var(--font-size-xl);
    }
    
    svg {
      font-size: 4rem;
    }
  }
`

const Recente = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 80%;
  padding: var(--spacing-xs);

  svg {
    font-size: var(--font-size-lg);
    color: #969FB0;
    flex-shrink: 0;
  }

  a {
    margin-left: var(--spacing-xs);
    text-decoration: none;
    color: var(--text-color);
    cursor: pointer;
    font-size: var(--font-size-sm);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    width: 90%;
    
    svg {
      font-size: var(--font-size-base);
    }
    
    a {
      font-size: var(--font-size-xs);
    }
  }
`

const BtnMenor = styled.button`
  width: 80%;
  min-height: 80px;
  max-height: 123px;
  border-radius: 20px;
  background-color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid var(--secondary-color);
  color: #fff;
  font-size: var(--font-size-lg);
  
  transition: background-color 0.3s ease; 

  &:hover {
    background-color: var(--primary-hover); 
    cursor: pointer; 
  }

  @media (max-width: 768px) {
    min-height: 60px;
    font-size: var(--font-size-base);
  }

  @media (min-width: 1441px) {
    min-height: 100px;
    font-size: var(--font-size-xl);
  }
`

const Perfil = styled.div`
  width: 85%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  color: #fff;
  background-color: #326886;
  border: 5px solid var(--secondary-color);
  border-radius: 20px;
  margin-top: auto;
  margin-bottom: var(--spacing-xl);
  box-sizing: border-box;

  svg {
    font-size: var(--font-size-2xl);
    color: #fff;
    flex-shrink: 0;
  }

  p {
    font-size: var(--font-size-sm);
    margin: 0;
    flex: 1;
    text-align: left;
  }

  button {
    width: 20%; 
    height: 70%; 
    background-color: var(--primary-color);
    border: none;
    border-radius: 10px;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button:hover {
    background-color: var(--primary-hover); 
    cursor: pointer; 
  }

  button svg {
    font-size: var(--font-size-lg);
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: var(--spacing-xs);
    
    svg {
      font-size: var(--font-size-xl);
    }
    
    p {
      font-size: var(--font-size-xs);
    }
    
    button svg {
      font-size: var(--font-size-base);
    }
  }
`

const Divider = styled.hr`
  width: 80%;
  border: none;
  border-top: 1px solid #ccc;
  margin: var(--spacing-sm) 0;
`

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
`

export default function Sidebar(props) {
  const [showPopup, setShowPopup] = useState(false);
  const { project, setProject } = useProject();

  const { currentUser, logout, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout(); // Chama a função de logout do contexto
      navigate('/'); // Navega para a página de login
  };

  const togglePopup = () => setShowPopup(!showPopup);
  const handleClick = () => navigate("/projects");

  return (
    <Container>
      <Link to="/projects" style={{ textAlign: 'center' }}>
        <img src={logo} width='30%' alt='ovo com rachadura' />
      </Link>
      
      <BntMaior onClick={togglePopup}>
        <span>Novo Projeto</span>
        <IoIosAdd />
      </BntMaior>

      {showPopup && (
        <NovoProjetoPopup onClose={togglePopup} onSubmit={(data) => setProject(data)} />
      )}

      <Section>
        <Recente>
          <FaFolder />
          <a href='/'>Lorem ipsum dolor sit amet</a>
        </Recente>

        <Recente>
          <FaFolder />
          <a href='/'>Lorem ipsum dolor sit amet</a>
        </Recente>

        <Recente>
          <FaFolder />
          <a href='/'>Lorem ipsum dolor sit amet</a>
        </Recente>
      </Section>

      <Divider />

      <Section>
        <BtnMenor onClick={handleClick}>Projetos</BtnMenor>
        <BtnMenor>Dashboard</BtnMenor>
      </Section>

      <Perfil>
        <FaRegUserCircle />
        {/* ALTERADO: Exibindo dados reais do usuário */}
        {isLoadingAuth ? (
          <p>Carregando...</p>
        ) : currentUser ? (
          <p>
            <strong>{currentUser.name}</strong>
            <br />
            ID: {currentUser.id}
          </p>
        ) : (
          <p>Não conectado</p>
        )}
        <button onClick={handleLogout}><IoExitOutline /></button>
      </Perfil>
    </Container>
  );
}

