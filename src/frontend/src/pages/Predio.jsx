import React from "react";
import Sidebar from "../components/Sidebar";
import NavHome from "../components/NavHome";
import styled from "styled-components";
import FoldersSection from "../components/FoldersSection";
import { useParams } from "react-router-dom";

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

  const fachadas = [
    "Fachada Leste",
    "Fachada Oeste",
    "Fachada Norte",
    "Fachada Sul",
  ];

  return (
    <PredioPage>
      <Sidebar />
      <Body>
        <NavHome />
        <h2 style={{ margin: '2rem 0 0 2rem', fontSize: '1.8rem' }}>
          Prédio: {decodeURIComponent(predioNome)} <br />
          <small style={{ fontSize: '1rem', color: '#666' }}>Projeto ID: {projectId}</small>
        </h2>
        <FoldersSection
          folders={fachadas}
          path={`/project/${projectId}/predio/${encodeURIComponent(predioNome)}`}
        />
      </Body>
    </PredioPage>
  );
}
