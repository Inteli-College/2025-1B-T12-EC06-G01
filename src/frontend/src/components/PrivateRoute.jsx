import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Importe o hook

const PrivateRoute = () => {
  // Pega não só o token, mas também o estado do usuário e o estado de carregamento
  const { currentUser, token, isLoadingAuth } = useAuth();

  // 1. Se estamos no processo de verificação inicial, exibe uma mensagem de carregamento.
  // Esta é a "tela de espera" que resolve a race condition.
  if (isLoadingAuth) {
    return <div>Verificando autenticação...</div>;
  }

  // 2. Após a verificação, se não houver token/usuário, redireciona para o login.
  return token && currentUser ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;