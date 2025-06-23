import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Verifica se o token existe no localStorage
  const token = localStorage.getItem('jwt_token');

  // Se o token existe, renderiza a página solicitada (Outlet).
  // Se não, redireciona para a página de login ('/').
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;