// src/components/SendPopup.jsx
import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

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

  .popup-buttons button:hover {
      background-color: #3D80A3;
  }
`

export default function SendPopup({
  projects,
  buildings,
  facades,
  selectedProject,
  selectedBuilding,
  selectedFacade,
  setSelectedProject,
  setSelectedBuilding,
  setSelectedFacade,
  onSend,
  onClose
}) {

  let navigate = useNavigate();

  return (
    <PopupWrapper>
      <div className="popup-inner">
        <h2>Enviar Imagens para Classificação</h2>

        <select onChange={(e) => setSelectedProject(parseInt(e.target.value))} value={selectedProject}>
          <option value=''>Selecione o projeto</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedBuilding(parseInt(e.target.value))} value={selectedBuilding} disabled={!selectedProject}>
          <option value=''>Selecione o prédio</option>
          {buildings.map(b => (
            <option key={b.id} value={b.id}>{b.predio}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedFacade(e.target.value)} value={selectedFacade} disabled={!selectedBuilding}>
          <option value=''>Selecione a fachada</option>
          {facades.map((f, index) => (
            <option key={index} value={f}>{f}</option>
          ))}
        </select>

        <div className="popup-buttons">
          <button onClick={onSend}>Enviar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </PopupWrapper>
  )
}
