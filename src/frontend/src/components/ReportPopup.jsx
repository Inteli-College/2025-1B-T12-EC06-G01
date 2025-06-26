import React from 'react';
import styled from 'styled-components';

// Reutilizando os estilos do SendPopup
const PopupWrapper = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;

  .popup-inner {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 400px;
  }

  select {
      padding: .5rem;
      border-radius: 10px;
      border: 1px solid gray;
  }

  .popup-buttons {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
  }

  .popup-buttons button {
      flex: 1;
      padding: .5rem;
      border-radius: 10px;
      border: none;
      background-color: #629EBC;
      color: white;
      font-weight: bold;
      cursor: pointer;
  }
`;

export default function ReportPopup({
  projects,
  selectedProject,
  setSelectedProject,
  onDownload,
  onClose
}) {
  return (
    <PopupWrapper>
      <div className="popup-inner">
        <h2>Gerar Relatório de Projeto</h2>
        <p>Selecione o projeto para gerar o relatório em PDF.</p>

        <select 
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Selecione um projeto</option>
          {/* Este .map() agora está seguro, pois sempre receberá a prop 'projects' */}
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <div className="popup-buttons">
          <button onClick={onDownload}>Gerar PDF</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </PopupWrapper>
  );
}