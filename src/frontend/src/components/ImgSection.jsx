import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CardImg from './CardImg';
import axios from 'axios';

const Page = styled.div`
  margin-left: var(--sidebar-width, 280px);

  .btn-section {
    padding: var(--spacing-lg) var(--spacing-xl) 0 var(--spacing-xl);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  button {
    width: 20%;
    min-width: 150px;
    min-height: 50px;
    border-radius: 10px;
    background-color: var(--primary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid var(--secondary-color);
    color: #fff;
    font-size: var(--font-size-base);
    padding: var(--spacing-sm);
    transition: all 0.3s ease;
  } 

  button:hover {
    background-color: var(--primary-hover); 
    cursor: pointer; 
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    margin-left: 0;
    
    .btn-section {
      padding: var(--spacing-md);
      flex-direction: column;
      gap: var(--spacing-sm);
    }
    
    button {
      width: 100%;
      min-width: auto;
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    margin-left: 200px;
    
    .btn-section {
      padding: var(--spacing-md);
    }
    
    button {
      width: 30%;
      min-width: 120px;
    }
  }

  @media (min-width: 1441px) {
    margin-left: 320px;
    
    .btn-section {
      padding: var(--spacing-xl) var(--spacing-xl) 0 var(--spacing-xl);
    }
    
    button {
      width: 15%;
      min-width: 180px;
      font-size: var(--font-size-lg);
    }
  }
`

const Container = styled.div`
    width: calc(100vw - var(--sidebar-width, 280px));
    padding: var(--spacing-xl);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    justify-items: center;
    gap: var(--spacing-lg);
    max-width: 100%;

    @media (max-width: 480px) {
        width: 100vw;
        padding: var(--spacing-md);
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
    }

    @media (min-width: 481px) and (max-width: 768px) {
        width: calc(100vw - 200px);
        padding: var(--spacing-lg);
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    @media (min-width: 769px) and (max-width: 1024px) {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    @media (min-width: 1025px) and (max-width: 1440px) {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    @media (min-width: 1441px) {
        width: calc(100vw - 320px);
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-xl);
    }
`;

const Popup = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex; 
  justify-content: center; 
  align-items: center;
  z-index: 9999;

  .popup-inner {
    background: white;
    padding: var(--spacing-lg);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    min-width: 400px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
  }
      
  .file-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .file-section label {
    background-color: var(--primary-color);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }

  .file-section label:hover {
    background-color: var(--primary-hover);
  }

  .file-section input {
    display: none;
  }

  .file-section p {
    font-size: var(--font-size-sm);
    color: var(--text-color);
  }

  .popup-buttons {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-sm);
  }

  .popup-buttons button {
    flex: 1;
    padding: var(--spacing-xs);
    border-radius: 10px;
    border: none;
    background-color: var(--primary-color);
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .popup-buttons button:hover {
    background-color: var(--primary-hover);
  }

  @media (max-width: 480px) {
    .popup-inner {
      min-width: 90vw;
      padding: var(--spacing-md);
    }
    
    .popup-buttons {
      flex-direction: column;
    }
  }
`

export default function ImgSection() {
  const { fachadaNome } = useParams();
  const location = useLocation();
  const fachadaId = location.state?.fachadaId;
  const buildingId = location.state?.buildingId;

  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  }

  const sendImages = async () => {
    if (!images || images.length === 0) {
      alert("Selecione ao menos uma imagem.");
      return;
    }

    const formData = new FormData();
    formData.append('facade_id', fachadaId);
    formData.append('building_id', buildingId);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const response = await axios.post('http://localhost:5000/images/', formData);
      console.log("Upload realizado com sucesso:", response.data);

      togglePopup();
      setImages([]);
      setLoading(true);
    } catch (err) {
      console.error("Erro ao enviar imagens:", err);
    }
  };

  useEffect(() => {
    const fetchImagens = async () => {
      if (fachadaId === undefined || fachadaId === null) {
        console.error("Fachada ID não encontrado no state.", { fachadaId });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/images/facade/${fachadaId}`);
        console.log("Resposta da API:", response.data);
        console.log("fachadaId:", fachadaId);

        let imgs = [];
        if (Array.isArray(response.data)) {
          imgs = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          imgs = response.data.data;
        } else if (response.data.imagens && Array.isArray(response.data.imagens)) {
          imgs = response.data.imagens;
        } else {
          console.warn("Formato inesperado de resposta da API.", response.data);
        }

        setImagens(imgs);
      } catch (err) {
        console.error("Erro ao buscar imagens da fachada:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImagens();
  }, [fachadaId]);

  if (loading) {
    return <p style={{ marginLeft: "18vw", padding: "2.5rem" }}>Carregando imagens da fachada: {fachadaNome}</p>;
  }

  if (!imagens || imagens.length === 0) {
    return (
      <Page>
        <p style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>
          Nenhuma imagem cadastrada para esta fachada.
        </p>

        <div className='btn-section'>
          <button onClick={togglePopup}>+ Adicionar imagens</button>
        </div>
        {showPopup && (
          <Popup>
            <div className='popup-inner'>
              <div className="file-section">
                <label htmlFor="file-input">Escolher arquivos</label>
                <input id="file-input" type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files))} />
                <p>{images.length > 0 ? `${images.length} arquivo(s) selecionado(s)` : 'Nenhum arquivo escolhido'}</p>
              </div>
              <div className="popup-buttons">
                <button type="submit" onClick={sendImages}>Enviar</button>
                <button onClick={togglePopup}>Cancelar</button>
              </div>
            </div>
          </Popup>
        )}
      </Page>
    );
  }

  return (
    <Page>
      <div className='btn-section'>
        <button onClick={togglePopup}>+ Adicionar imagens</button>
      </div>
      <Container>

        {showPopup && (
          <Popup>
            <div className='popup-inner'>
              <div className="file-section">
                <label htmlFor="file-input">Escolher arquivos</label>
                <input id="file-input" type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files))} />
                <p>{images.length > 0 ? `${images.length} arquivo(s) selecionado(s)` : 'Nenhum arquivo escolhido'}</p>
              </div>
              <div className="popup-buttons">
                <button type="submit" onClick={sendImages}>Enviar</button>
                <button onClick={togglePopup}>Cancelar</button>
              </div>
            </div>
          </Popup>
        )}
        {imagens.map((img, index) => (
          <CardImg key={index} img_name={img.img_name} url={img.raw_img} />
        ))}
      </Container>
    </Page>
  );
}
