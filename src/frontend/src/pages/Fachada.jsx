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
        <ImgSection predio={predioNome} fachada={fachadaNome} />
      </Body>
    </FachadaPage>
  )
}
