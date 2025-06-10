import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NavHome from "../components/NavHome";
import styled from "styled-components";
import FoldersSection from "../components/FoldersSection";
import { useParams } from "react-router-dom";
import axios from "axios";

const PredioPage = styled.div`
  display: flex;
  flex-direction: row;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default function Predio() {
  const { projectId, predioNome } = useParams();
  const [fachadas, setFachadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFachadas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Buscar todos os prédios do projeto
        const buildingsResponse = await axios.get(`http://localhost:5000/building/project/${projectId}`);
        const buildings = buildingsResponse.data;

        // Encontrar o prédio atual pelo nome
        const currentBuilding = buildings.find(
          (building) => building.predio === decodeURIComponent(predioNome)
        );

        if (currentBuilding) {
          // Buscar fachadas associadas ao prédio
          const facadesResponse = await axios.get(
            `http://localhost:5000/facade/building/${currentBuilding.id}`
          );

          console.log("Resposta da API de fachadas:", facadesResponse.data);

          if (facadesResponse.data && facadesResponse.data.fachadas) {
            setFachadas(facadesResponse.data.fachadas);
          } else {
            setFachadas([]);
          }
        } else {
          console.error(`Prédio "${predioNome}" não encontrado no projeto ${projectId}`);
          setError(new Error("Prédio não encontrado"));
          setFachadas([]);
        }
      } catch (err) {
        console.error("Erro ao buscar fachadas:", err);
        setError(err);

        // Se for erro 404 (nenhuma fachada encontrada), usar lista vazia
        if (err.response && err.response.status === 404) {
          setFachadas([]);
        } else {
          setFachadas([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId && predioNome) {
      fetchFachadas();
    }
  }, [projectId, predioNome]);


  // Preparar dados das fachadas no formato esperado pelo FoldersSection
  const fachadasFormatted = fachadas.map((fachada, index) => ({
    id: index,
    predio: fachada
  }));

  return (
    <PredioPage>
      <Sidebar />
      <Body>
        <NavHome />
        {isLoading ? (
          <div style={{
            width: '77vw',
            marginLeft: '18vw',
            padding: '2.5rem',
            textAlign: 'center',
            color: '#666'
          }}>
            Carregando fachadas...
          </div>
        ) : (
          <FoldersSection
            folders={fachadasFormatted}
            path={`/project/${projectId}/predio/${encodeURIComponent(predioNome)}`}
            folderNameField="predio"
            folderIdField="id"
          />
        )}
      </Body>
    </PredioPage>
  );
}
