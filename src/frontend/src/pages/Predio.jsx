import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NavHome from "../components/NavHome";
import styled from "styled-components";
import FoldersSection from "../components/FoldersSection";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

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
  const { token } = useAuth();
  const [fachadas, setFachadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBuildingId, setCurrentBuildingId] = useState(null);


  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchFachadas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const buildingsResponse = await axios.get(`http://localhost:5000/building/project/${projectId}`, config);
        const buildings = buildingsResponse.data;

        const currentBuilding = buildings.find(
          building => building.predio === decodeURIComponent(predioNome)
        );

        if (currentBuilding) {
          // ALTERADO: Adiciona o 'config' com o token também à segunda chamada
          const facadesResponse = await axios.get(
            `http://localhost:5000/facade/building/${currentBuilding.id}`,
            config
          );

          setCurrentBuildingId(currentBuilding.id);

          if (facadesResponse.data && facadesResponse.data.fachadas) {
            setFachadas(facadesResponse.data.fachadas);
          } else {
            setFachadas([]);
          }
        } else {
          setError(new Error("Prédio não encontrado"));
          setFachadas([]);
        }
      } catch (err) {
        console.error("Erro ao buscar fachadas:", err);
        setError(err);
        setFachadas([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId && predioNome) {
      fetchFachadas();
    }
  }, [projectId, predioNome, token]); 
  
  //Formata as fachadas para exibir nome e passar id
  const fachadasFormatted = fachadas.map((fachada, index) => {
    if (typeof fachada === "string") {
      return {
        id: index,
        predio: fachada
      };
    } else {
      return {
        id: fachada.id,
        predio: fachada.nome
      };
    }
  });

  console.log("fachadasFormatted:", fachadasFormatted);

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
            addUrl="http://localhost:5000/facade/"
            folderId={currentBuildingId}
          />

        )}
      </Body>
    </PredioPage>
  );
}
