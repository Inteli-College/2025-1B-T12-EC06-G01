import React from 'react'
import Sidebar from '../components/Sidebar'
import NavHome from '../components/NavHome'
import styled from 'styled-components'
import FoldersSection from '../components/FoldersSection'
import { useParams } from 'react-router-dom'

const PredioPage = styled.div`
  display: flex;
  flex-direction: row;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export default function Predio() {
  const { projectName, predioNome } = useParams() 

  const fachadas = [
    "Fachada Leste",
    "Fachada Oeste",
    "Fachada Norte",
    "Fachada Sul"
  ]

  return (
    <PredioPage>
      <Sidebar />
      <Body>
        <NavHome />
        <FoldersSection
          folders={fachadas}
          path={`/projetos/${encodeURIComponent(projectName)}/${encodeURIComponent(predioNome)}`}
        />
      </Body>
    </PredioPage>
  )
}
