import React, { useRef } from 'react';
import styled from 'styled-components';

const Popup = styled.div`
  background-color: #3D80A3;
  width: 15vw;
  padding: 2rem;
  border: 5px solid #2E2E2E;
  border-radius: 20px;
  color: #fff;

  display: flex;
  flex-direction: column;

  position: fixed;
  top: 21%;
  left: 1%;

  h3 {
    margin: .5rem 0;
  }

  input {
    background-color: #D7D7D7;
    border: none;
    width: 90%;
  }

  #nome-projeto {
    background-color: #BDE0EE;
    height: 2rem;
    border-radius: 15px;
  }

  #nome-contratante, #data {
    background-color: #97C6D9;
    height: 1.5rem;
    border-radius: 15px;
  }

  button {
    border: 5px solid #629EBC;
    border-radius: 10px;
    padding: .3rem;
    background-color: #BDE0EE;
    width: 70%;
    font-size: 28px;
    color: #0A3B4E;
  }

  button:hover {
    background-color: #97C6D9; 
    cursor: pointer; 
  }
`;

export default function NovoProjetoPopup({ onClose, onSubmit }) {
  const nameRef = useRef();
  const contractorRef = useRef();
  const dateRef = useRef();

  const handleSubmit = () => {
    onSubmit({
      name: nameRef.current.value,
      contractor: contractorRef.current.value,
      date: dateRef.current.value
    });
    onClose();
  };

  return (
    <Popup>
      <div>
        <h3>Nome do projeto</h3>
        <input type="text" ref={nameRef} id="nome-projeto" />

        <h3>Nome do contratante</h3>
        <input type="text" ref={contractorRef} id="nome-contratante" />

        <h3>Data</h3>
        <input type="date" ref={dateRef} id="data" />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '2rem', gap: '.5rem'}}>
          <button onClick={handleSubmit}>Enviar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </Popup>
  );
}
