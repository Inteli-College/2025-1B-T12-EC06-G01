import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const navigate = useNavigate();

  // Este useEffect roda quando a aplicação carrega
  useEffect(() => {
    if (token) {
      // Se um token existe, busca os dados do usuário
      const fetchUserData = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.get('http://localhost:5000/me', config);
          setCurrentUser(response.data);
        } catch (error) {
          // Se o token for inválido/expirado, limpa tudo
          console.error("Falha ao buscar usuário com token:", error);
          logout();
        }
      };
      fetchUserData();
    }
  }, [token]); // Roda sempre que o token mudar

  const login = async (email, password) => {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem('jwt_token', data.token);
      setToken(data.token); // Atualiza o estado do token, disparando o useEffect
      navigate('/projects');
      return { success: true };
    } else {
      return { success: false, message: data.message || "Erro no login." };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setCurrentUser(null);
    setToken(null);
    navigate('/');
  };

  const value = { currentUser, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};