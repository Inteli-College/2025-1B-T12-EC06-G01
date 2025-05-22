import React from 'react'
import Sidebar from '../components/Sidebar'
import NavHome from '../components/NavHome'
import styled from 'styled-components'
import FoldersSection from '../components/FoldersSection'
import { useParams } from 'react-router-dom'

const ProjectPage = styled.div`
  display: flex;
  flex-direction: row;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
`

export default function Projeto() {
  const { projectName } = useParams()  

  const buildings = [
    "Prédio 1",
    "Prédio 2",
    "Prédio 3",
    "Prédio 4",
    "Prédio 5"
  ]

  return (
    <ProjectPage>
      <Sidebar />
      <Body>
        <NavHome />
        <FoldersSection folders={buildings} path={`/projetos/${encodeURIComponent(projectName)}`} />
      </Body>
    </ProjectPage>
  )
}
