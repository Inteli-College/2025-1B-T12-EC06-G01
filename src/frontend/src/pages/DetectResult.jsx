// src/pages/DetectResult.jsx
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 2rem;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
`;

export default function DetectResult() {
  const { facadeId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const detected = state?.detected || {};

  if (!state) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Nenhum resultado de detecção foi passado.</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  return (
    <div>
      <nav style={{ padding: '1rem' }}>
        <button onClick={() => navigate(-1)}>← Voltar</button>
      </nav>
      <h1 style={{ paddingLeft: '1rem' }}>Detecção para fachada {facadeId}</h1>
      <Grid>
        {Object.entries(detected).map(([url, b64]) => (
          <Card key={url}>
            <img src={b64} alt="detected" style={{ width: '100%', borderRadius: '4px' }} />
            <p style={{ fontSize: '0.7rem', wordBreak: 'break-all' }}>{url}</p>
          </Card>
        ))}
      </Grid>
    </div>
  );
}
