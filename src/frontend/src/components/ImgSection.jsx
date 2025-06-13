import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CardImg from './CardImg';
import axios from 'axios';

const Container = styled.div`
    width: 77vw;
    margin-left: 18vw;
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
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
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
      <Container>
        <p style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>
          Nenhuma imagem cadastrada para esta fachada.
        </p>

        <button onClick={togglePopup}>+ Adicionar imagens</button>
        {showPopup && (
          <div>
            <input type="file" accept='image/*' multiple onChange={e => setImages(Array.from(e.target.files))} />
            <button type="submit" onClick={sendImages}>Enviar</button>
            <button onClick={togglePopup}>Cancelar</button>
          </div>
        )}
      </Container>
    );
  }

  return (
    <Container>
      <div>
        <button onClick={togglePopup}>+ Adicionar imagens</button>
      </div>
        {showPopup && (
          <Popup>
            <input type="file" accept='image/*' multiple onChange={e => setImages(Array.from(e.target.files))} />
            <button type="submit" onClick={sendImages}>Enviar</button>
            <button onClick={togglePopup}>Cancelar</button>
          </Popup>
        )}
      {imagens.map((img, index) => (
        <CardImg key={index} img_name={img.img_name} url={img.raw_img} />
      ))}
    </Container>
  );
}
