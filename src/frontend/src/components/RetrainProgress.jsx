// src/pages/RetrainProgress.jsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const socket = io('http://localhost:5000');  

const RetrainSection = styled.div`
  padding: 1.5rem 2.5rem;

  button {
    border: 2px solid #0A3B4E;
    border-radius: 15px;
    background-color: #629EBC;
    color: #fff;
    padding: 2rem;
  }

  button:hover {
    background-color: #3D80A3;
    cursor: pointer;
  }

`

export default function RetrainProgress() {
  const { token } = useAuth();
  const [progresso, setProgresso] = useState(0);
  const [mensagem, setMensagem] = useState('');
  const [treinando, setTreinando] = useState(false);

  useEffect(() => {
    // Só tenta se conectar se o token existir
    if (!token) return;

    // Conecta ao socket enviando o token para autenticação
    const socket = io('http://localhost:5000', {
      auth: {
        token: `Bearer ${token}`
      }
    });

    socket.on('connect', () => {
      console.log('Conectado ao servidor de Socket.IO com sucesso!');
    });

    socket.on('training_progress_fe', (msg) => {
      console.log('PROGRESSO RECEBIDO:', msg);
      const valor = typeof msg.message === 'number'
        ? msg.message
        : parseInt(msg.message.toString().replace('%', '')) || 0;
      setProgresso(valor);
      if (valor >= 100) {
        setMensagem('Treinamento concluído!');
        setTreinando(false);
      }
    });

    return () => {
      console.log('Desconectando do socket...');
      socket.disconnect();
    };
  }, [token]);

  const iniciarTreinamento = async () => {
    setTreinando(true);
    setProgresso(0);
    setMensagem('');

    try {
      const response = await fetch('http://localhost:5000/classify/retrain', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMensagem(data.message);
    } catch (err) {
      console.error('Erro ao iniciar treinamento:', err);
      setMensagem('Erro ao iniciar treinamento');
      setTreinando(false);
    }
  };

  return (
    <RetrainSection>
      <h2>Re-Treinar Modelo</h2>

      <button onClick={iniciarTreinamento} disabled={treinando} style={{
        padding: '10px 20px',
        fontSize: '16px'
      }}>
        {treinando ? 'Treinando...' : 'Iniciar Re-Treinamento'}
      </button>

      {treinando && (
        <>
          <div style={{
            marginTop: '20px',
            height: '30px',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progresso}%`,
              backgroundColor: '#4caf50',
              transition: 'width 0.5s'
            }}></div>
          </div>
          <p>{progresso}%</p>
        </>
      )}

      {mensagem && <p style={{ marginTop: '10px' }}>{mensagem}</p>}
    </RetrainSection>
  );
}
