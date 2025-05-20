import React from 'react'
import styled from 'styled-components'
import Sidebar from '../components/Sidebar'
import NavHome from '../components/NavHome'
import ImgSection from '../components/ImgSection'
import { ProjectProvider } from '../contexts/ProjectContext'

const FolderPage = styled.div`
  display: flex;
  flex-direction: row;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
`

export default function Folder() {
    return (
        <ProjectProvider>
            <FolderPage>
                <Sidebar />

                <Body>
                    <NavHome />
                    <ImgSection />
                </Body>
            </FolderPage>
        </ProjectProvider>
    )
}
