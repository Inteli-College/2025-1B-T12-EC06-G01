import React from 'react'
import Sidebar from '../components/Sidebar'
import NavHome from '../components/NavHome'
import styled from 'styled-components'
import ProjectSection from '../components/ProjectSection'
import { ProjectProvider } from '../contexts/ProjectContext'

const Homepage = styled.div`
  display: flex;
  flex-direction: row;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
`

export default function Home() {

  return (
    <ProjectProvider>
      <Homepage>
        <Sidebar />


        <Body>
          <NavHome />
          <ProjectSection />
        </Body>

      </Homepage>
    </ProjectProvider>
  )
}
