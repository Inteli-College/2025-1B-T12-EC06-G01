import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import NavHome from '../components/NavHome';
import FoldersSection from '../components/FoldersSection';
import { useAuth } from '../contexts/AuthContext';

const ProjectPrediosPage = styled.div`
  display: flex;
  flex-direction: row;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default function ProjectPredios() {
  const { projectId } = useParams();
  const { token } = useAuth(); 

  return (
    <ProjectPrediosPage>
      <Sidebar />
      <Body>
        <NavHome />
        <FoldersSection
          apiUrl={`http://localhost:5000/building/project/${projectId}`}
          authToken={token} // Passa o token como uma prop
          path={`/project/${projectId}/predio`}
          folderNameField="predio"
          folderIdField="id"
          addUrl={'http://localhost:5000/building/'}
          btnLabel="Prédio"
        />
      </Body>
    </ProjectPrediosPage>
  );
}
