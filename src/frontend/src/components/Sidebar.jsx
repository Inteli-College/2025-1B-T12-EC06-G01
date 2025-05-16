import React, { useState } from 'react'
import styled from 'styled-components'
import { IoIosAdd } from "react-icons/io"
import { FaRegUserCircle, FaUpload, FaFolder } from "react-icons/fa"
import logo from '../logo.svg'

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
  background-color: #629EBC;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid #2e2e2e;
  padding: 1rem;
  transition: background-color 0.3s ease; 

  &:hover {
    background-color: #3D80A3; 
    cursor: pointer; 
  }

  span, svg {
    font-size: 32px;
    color: #fff;
    text-transform: uppercase;
    text-align: center;
  }

  svg {
    font-size: 72px;
  }
`

const Recente = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  svg {
    font-size: 1.5rem;
    color: #969FB0;
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
  background-color: #629EBC;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid #145E7A;
  color: #fff;
  font-size: 28px;
  text-transform: uppercase;
  
  transition: background-color 0.3s ease; 

  &:hover {
    background-color: #3D80A3; 
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
  color: #fff;

  background-color: #326886;
  border: 5px solid #145E7A;
  border-radius: 20px;


  svg {
    font-size: 2.3rem;
  }

  button {
    width: 20%; 
    height: 70%; 
    background-color: #629EBC;
    border: none;
    border-radius: 10px;
    transition: background-color 0.3s ease; 
  }

  button:hover {
    background-color: #3D80A3; 
    cursor: pointer; 
  }

  p {
    text-transform: uppercase;
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
      <img src={logo} width='45%' alt='ovo com rachadura' />

      <BntMaior onClick={togglePopup}>
        <span>Novo Projeto</span>
        <IoIosAdd />
      </BntMaior>
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
      </section>

      <hr style={{ width: '80%' }} />

      <section style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.8rem' }}>
        <BtnMenor>Projetos</BtnMenor>
        <BtnMenor>Dashboard</BtnMenor>
      </section>

      <Perfil>
        <FaRegUserCircle />
        <p>
          <strong>Nome do usuáro</strong>
          <br />
          ID:12345
        </p>
        <button>bnt</button>
      </Perfil>

    </Container>
  )
}
