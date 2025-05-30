import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import NavHome from '../components/NavHome';
import FoldersSection from '../components/FoldersSection';

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

  return (
    <ProjectPrediosPage>
      <Sidebar />
      <Body>
        <NavHome />
        <FoldersSection
          apiUrl={`http://10.128.0.31:5000/building/project/${projectId}`}
          path={`/project/${projectId}/predio`}
          folderNameField="predio"
          folderIdField="id"
        />
      </Body>
    </ProjectPrediosPage>
  );
}
