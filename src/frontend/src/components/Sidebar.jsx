import React, { useState } from 'react'
import styled from 'styled-components'
import { IoMdDocument } from "react-icons/io"
import { FaRegUserCircle, FaUpload } from "react-icons/fa"

const Container = styled.div`
  width: 18vw;
  height: 100vh;
  overflow-y: hidden;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #D9D9D9;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.8rem;
  padding: .5rem 0;
`

const BntMaior = styled.button`
  width: 80%;
  height: 150px;
  border-radius: 20px;
  background-color: #8F8F8F;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  
  transition: background-color 0.3s ease; 
  &:hover {
    background-color: #6f6f6f; 
    cursor: pointer; 
  }
`

const Recente = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  svg {
    font-size: 1.5rem;
    color: #8F8F8F;
  }

  a {
    margin: 0.3rem ;
    text-decoration: none;
    color: #000;
    cursor: pointer;
  }

  a:hover {
    text-decoration: underline;
  }
`

const BtnMenor = styled.button`
  width: 80%;
  height: 123px;
  border-radius: 20px;
  background-color: #8F8F8F;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  
  transition: background-color 0.3s ease; 

  &:hover {
    background-color: #6f6f6f; 
    cursor: pointer; 
  }
`

const Perfil = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: .3rem;
  padding: .5rem;

  background-color: #8F8F8F;
  border-radius: 20px;


  svg {
    font-size: 2.3rem;
  }

  button {
    width: 20%; 
    height: 70%; 
    background-color: #545454;
    border: none;
    border-radius: 10px;
    transition: background-color 0.3s ease; 
  }

  button:hover {
    background-color:rgb(60, 60, 60); 
    cursor: pointer; 
  }
`

const Popup = styled.div`
  background-color: #8F8F8F;
  padding: 2rem;
  border-radius: 20px;
  color: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  z-index: 1000;
  position: fixed;
  top: 21%;

  h3 {
    margin: .5rem 0;
  }

  input {
    background-color: #D7D7D7;
    border: none;
  }

  input:hover {
    border: 2px solid #6f6f6f;
  }

  button {
    border: none;
    border-radius: 10px;
    padding: .3rem;
  }

  button:hover {
    background-color: #6f6f6f; 
    cursor: pointer; 
    color: #fff;
  }

  svg {
    margin: 1rem 0;
    font-size: 1rem;
  }

  svg:hover {
    font-size: 2rem;
  }
`

export default function Sidebar() {

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup)
  }

  const project = {
    name: '',
    contractor: '',
    date: ''
  }

  return (
    <Container>
      <div style={{ width: '80%', height: 100, backgroundColor: '#fff' }} />

      <BntMaior onClick={togglePopup}>Adicionar Projeto</BntMaior>
      {showPopup && (
        <Popup>
          <div>
            <h3>Nome do projeto</h3>
            <input type='text' placeholder='Nome do projeto' onChange={(e) => (project.name = e.target.value)} />

            <h3>Nome do contratante</h3>
            <input type='text' placeholder='Nome do contratante' onChange={(e) => (project.contractor = e.target.value)} />

            <h3> Data</h3>
            <input type='date' onChange={(e) => (project.date = e.target.value)} />

            <div>
              <FaUpload />
            </div>
            <button onClick={togglePopup}>concluir</button>
          </div>
        </Popup>        
      )}

      <section>
        <Recente>
          <IoMdDocument />
          <a href='/'>Lorem ipsum dolor sit amet</a>
        </Recente>

        <Recente>
          <IoMdDocument />
          <a href='/'>Lorem ipsum dolor sit amet</a>
        </Recente>

        <Recente>
          <IoMdDocument />
          <a href='/'>Lorem ipsum dolor sit amet</a>
        </Recente>
      </section>

      <hr style={{width: '80%'}} />

      <section style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.8rem'}}>
        <BtnMenor>Botão</BtnMenor>
        <BtnMenor>Botão</BtnMenor>
      </section>

      <Perfil>
        <FaRegUserCircle />
        <p>Nome do usuáro</p>
        <button>bnt</button>
      </Perfil>
      
    </Container>
  )
}
