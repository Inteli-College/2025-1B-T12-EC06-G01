import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { IoIosAdd } from "react-icons/io"
import { FaRegUserCircle, FaUpload, FaFolder } from "react-icons/fa"
import { IoExitOutline } from "react-icons/io5"
import logo from '../logo.svg'

const Container = styled.div`
  width: 18vw;
  height: 100vh;
  overflow-y: hidden;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #DCDFE5;
  box-shadow: 2px 0px 12px 2px rgba(0, 0, 0, 0.25);

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

  svg {
    color: #fff;
  }
`

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

  .upload {
    height: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin: 1rem 0;
    color: #BDE0EE;

    background-color: #0A3B4E;
    border: 5px solid #BDE0EE;
    border-radius: 15px;
  }

  .upload svg {
    margin: 1rem 0;
    font-size: 3rem;
  }

  .upload:hover {
    cursor: pointer;
  }

  button {
    border: 5px solid #629EBC;
    border-radius: 10px;
    padding: .3rem;
    background-color: #BDE0EE;
    width: 70%;

    font-size: 28px;
    color: 0A3B4E;
  }

  button:hover {
    background-color: #97C6D9; 
    cursor: pointer; 
  }
`

export default function Sidebar(props) {
  const [showPopup, setShowPopup] = useState(false);
  const [tempImages, setTempImages] = useState([]); 

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const nameRef = useRef();
  const contractorRef = useRef();
  const dateRef = useRef();

  const { project, setProject, setUploadedImages } = props;

  const handleConclude = () => {
    setProject({
      name: nameRef.current.value,
      contractor: contractorRef.current.value,
      date: dateRef.current.value
    });

    if (tempImages.length > 0) {
      setUploadedImages(prev => [...prev, ...tempImages]);
      setTempImages([]);
    }

    togglePopup();
  };

  return (
    <Container>
      <img src={logo} width='30%' alt='ovo com rachadura' />

      <BntMaior onClick={togglePopup}>
        <span>Novo Projeto</span>
        <IoIosAdd />
      </BntMaior>

      {showPopup && (
        <Popup>
          <div>
            <h3>Nome do projeto</h3>
            <input type='text' ref={nameRef} id='nome-projeto' />

            <h3>Nome do contratante</h3>
            <input type='text' ref={contractorRef} id='nome-contratante' />

            <h3> Data</h3>
            <input type='date' ref={dateRef} id='data' />

            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              id="upload-image"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const readers = files.map(file => {
                  return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      resolve({
                        img_name: file.name,
                        raw_img: reader.result,
                        project: nameRef.current?.value || 'Sem nome'
                      });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                  });
                });

                Promise.all(readers).then(results => {
                  setTempImages(results);
                });
              }}
            />

            <div
              className="upload"
              onClick={() => document.getElementById('upload-image').click()}
            >
              <FaUpload />
              Importar
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button onClick={handleConclude}>Enviar</button>
            </div>
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
        <button><IoExitOutline /></button>
      </Perfil>
    </Container>
  );
}

