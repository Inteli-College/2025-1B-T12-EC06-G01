import React, { useState, useEffect } from 'react';
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

export default function ImgSection() {
  const { fachadaNome } = useParams();
  const location = useLocation();
  const fachadaId = location.state?.fachadaId;

  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);

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
      </Container>
    );
  }

  return (
    <Container>
      {imagens.map((img, index) => (
        <CardImg key={index} img_name={img.img_name} url={img.raw_img} />
      ))}
    </Container>
  );
}
