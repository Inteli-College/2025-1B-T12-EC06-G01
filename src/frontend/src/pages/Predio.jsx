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
        // Primeiro, buscar todos os prédios do projeto
        const buildingsResponse = await axios.get(`http://10.128.0.31:5000/building/project/${projectId}`);
        const buildings = buildingsResponse.data;
          // Encontrar o prédio atual pelo nome (decodificado da URL)
        const currentBuilding = buildings.find(building => building.predio === decodeURIComponent(predioNome));
          if (currentBuilding) {
          // Buscar as fachadas usando o building_id com a nova rota RESTful
          const facadesResponse = await axios.get(`http://10.128.0.31:5000/facade/building/${currentBuilding.id}`);
          
          console.log('Resposta da API de fachadas:', facadesResponse.data);
          
          if (facadesResponse.data && facadesResponse.data.fachadas) {
            setFachadas(facadesResponse.data.fachadas);
          } else {
            // Se não há fachadas, usar lista vazia
            setFachadas([]);
          }
        } else {
          console.error(`Prédio "${predioNome}" não encontrado no projeto ${projectId}`);
          setError(new Error(`Prédio não encontrado`));
          // Fallback para fachadas padrão
          setFachadas([
            "Fachada Leste",
            "Fachada Oeste", 
            "Fachada Norte",
            "Fachada Sul",
          ]);
        }      } catch (err) {
        console.error('Erro ao buscar fachadas:', err);
        setError(err);
        
        // Se é um erro 404 (sem fachadas), usar lista vazia
        if (err.response && err.response.status === 404) {
          console.log('Nenhuma fachada encontrada para este prédio, usando lista vazia');
          setFachadas([]);
        } else {
          // Fallback para fachadas padrão em caso de outros erros
          console.log('Usando fachadas padrão devido a erro na API');
          setFachadas([
            "Fachada Leste",
            "Fachada Oeste",
            "Fachada Norte", 
            "Fachada Sul",
          ]);
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
