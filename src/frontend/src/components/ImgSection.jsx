import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CardImg from './CardImg';
import axios from 'axios';

const Page = styled.div`
  margin-left: 18vw;

  .btn-section {
    padding: 2rem 2.5rem 0 2.5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  button {
    width: 20%;
    height: 20px;
    border-radius: 10px;
    background-color: #629EBC;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid #145E7A;
    color: #fff;
    font-size: 16px;
    padding: 1rem;
    
    transition: background-color 0.3s ease;
  } 

  button:hover {
    background-color: #3D80A3; 
    cursor: pointer; 
  }
`

const Container = styled.div`
    width: 77vw;
    padding: 2.5rem;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    gap: 2rem;
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
    padding: 2rem;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 400px;
  }
      
  .file-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
  }

.file-section label {
  background-color: #629EBC;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.file-section label:hover {
  background-color: #3D80A3;
}


.file-section input {
  display: none;
}

.file-section p {
  font-size: 0.9rem;
  color: #333;
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
