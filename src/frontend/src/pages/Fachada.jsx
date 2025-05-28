import React from 'react'
import styled from 'styled-components'
import Sidebar from '../components/Sidebar'
import NavHome from '../components/NavHome'
import ImgSection from '../components/ImgSection'
import { useParams } from 'react-router-dom'

const FachadaPage = styled.div`
  display: flex;
  flex-direction: row;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export default function Fachada() {
  const { projectId, predioNome, fachadaNome } = useParams()

  return (
    <FachadaPage>
      <Sidebar />
      <Body>
        <NavHome />
        <h2 style={{ margin: '2rem 0 0 2rem', fontSize: '1.8rem' }}>
          Fachada: {decodeURIComponent(fachadaNome)} <br />
          Prédio: {decodeURIComponent(predioNome)} <br />
          <small style={{ fontSize: '1rem', color: '#666' }}>Projeto ID: {projectId}</small>
        </h2>
        <ImgSection predio={predioNome} fachada={fachadaNome} />
      </Body>
    </FachadaPage>
  )
}
