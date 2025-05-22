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
  const { predioNome } = useParams();

  const fachadas = [
    "Fachada Leste",
    "Fachada Oeste",
    "Fachada Norte",
    "Fachada Sul",
  ];
  
  //<FoldersSection folders={fachadas} path={`/predio/${encodeURIComponent(predioNome)}`} />
  // Comentei essa linha para não dar erro, mas depois descomente
  // quando o componente projects estiver pronto e integrado

  return (
    <PredioPage>
      <Sidebar />
      <Body>
        <NavHome />
        <FoldersSection
          folders={fachadas}
          path={`/predio/${encodeURIComponent(predioNome)}`}
        />
      </Body>
    </PredioPage>
  );
}
