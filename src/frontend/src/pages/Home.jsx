import React from "react";
import { Navigate } from 'react-router-dom';

export default function Home() {
  // Redireciona automaticamente para a página de projetos
  return <Navigate to="/projects" replace />;
}
