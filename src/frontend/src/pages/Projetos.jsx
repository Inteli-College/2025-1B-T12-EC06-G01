import React from 'react'
import Sidebar from '../components/Sidebar'
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
  width: 100%;

  h1 {
    margin-left: 22vw;
    padding: 2.5rem;
  }
`

export default function Projetos() {

    const { projectName } = useParams()

    const projetos = [
        "IPT",
        "Inteli",
        "Share Butantã",
        "Share Consolação",
        "FFLCH - USP",
        "FAU - USP",
        "Poli - USP"
    ]

    return (
        <ProjectPage>
            <Sidebar />
            <Body>
                <h1>Projetos já cadastrados</h1>
                <FoldersSection folders={projetos} path={`/projetos`} />
            </Body>
        </ProjectPage>
    )
}
