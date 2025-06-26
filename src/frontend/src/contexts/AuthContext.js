import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token'));
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const verifyUserToken = async () => {
      if (!token) {
        setIsLoadingAuth(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://localhost:5000/me', config);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Token inválido na verificação inicial, limpando sessão.", error);
        localStorage.removeItem('jwt_token');
        setToken(null);
        setCurrentUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    verifyUserToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      // A correção está aqui: especificamos o método POST e enviamos os dados
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST', // <-- GARANTE QUE A REQUISIÇÃO SEJA POST
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('jwt_token', data.token);
        setToken(data.token);
        // O navigate foi removido daqui para ser controlado pelo componente, o que está correto.
        return { success: true };
      } else {
        return { success: false, message: data.message || "Erro no login." };
      }
    } catch (error) {
      console.error("Erro de conexão na função de login:", error);
      return { success: false, message: "Erro de conexão." };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setCurrentUser(null);
  };

  const value = { currentUser, token, login, logout, isLoadingAuth };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};