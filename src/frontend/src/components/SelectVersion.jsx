import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 2rem;
  padding: 1rem 2rem;

  h2 {
    margin-bottom: 1rem;
  }

  p {
    margin-top: 1rem;
  }
`;

const VersionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  padding: 8px;
  text-align: left;
  background: #DCDFE5;
`;

const TableRow = styled.tr`
  background-color: ${props => (props.$selected ? '#e0f7fa' : 'white')};
`;

const TableCell = styled.td`
  padding: 8px;
`;

export default function SelectVersion() {
  const [versoes, setVersoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [versaoSelecionada, setVersaoSelecionada] = useState(null);

  useEffect(() => {
    const fetchVersoes = async () => {
      try {
        const response = await fetch('http://localhost:5000/classify/version', {
          method: 'POST',
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          const ordenado = data.sort((a, b) => {
            const extractTimestamp = path => {
                const match = path.match(/train_(\d{8})_(\d{6})/);
                return match ? `${match[1]}${match[2]}` : '';
            };

            const timeA = extractTimestamp(a.created_at);
            const timeB = extractTimestamp(b.created_at);

            return timeB.localeCompare(timeA); 
            });

            setVersoes(ordenado);

        } else {
          const txt = await response.text();
          throw new Error(`Resposta inesperada: ${txt}`);
        }
      } catch (err) {
        console.error('Erro ao buscar versões do modelo:', err);
        setErro('Erro ao carregar versões');
      } finally {
        setCarregando(false);
      }
    };

    fetchVersoes();
  }, []);

  function formatarData(path) {
    const match = path.match(/train_(\d{8})_(\d{6})/);
    if (!match) return path;

    const [_, data, hora] = match;
    const dia = data.slice(6, 8);
    const mes = data.slice(4, 6);
    const ano = data.slice(0, 4);
    const horaFormatada = `${hora.slice(0, 2)}:${hora.slice(2, 4)}`;

    return `${dia}/${mes}/${ano} ${horaFormatada}`;
  }

  return (
    <Wrapper>
      <h2>Histórico de Versões do Modelo</h2>

      {carregando && <p>Carregando versões...</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {!carregando && versoes.length === 0 && <p>Nenhuma versão encontrada.</p>}

      {versoes.length > 0 && (
        <VersionTable>
          <thead>
            <tr>
              <TableHeader>Versão</TableHeader>
              <TableHeader>Acurácia</TableHeader>
              <TableHeader>Data de Treino</TableHeader>
            </tr>
          </thead>
          <tbody>
            {versoes.map((v) => (
              <TableRow key={v.id} $selected={versaoSelecionada === v.id}>
                <TableCell>{v.version}</TableCell>
                <TableCell>{v.accuracy ? `${parseFloat(v.accuracy) * 100}%` : '--'}</TableCell>
                <TableCell>{formatarData(v.created_at)}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </VersionTable>
      )}
    </Wrapper>
  );
}
