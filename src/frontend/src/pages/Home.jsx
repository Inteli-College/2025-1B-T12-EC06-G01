import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ImgSection from '../components/ImgSection'
import NavHome from '../components/NavHome'
import styled from 'styled-components'

const Homepage = styled.div`
  display: flex;
  flex-direction: row;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
`

export default function Home() {
  const [project, setProject] = useState({
    name: '',
    contractor: '',
    date: ''
  })

  const [uploadedImages, setUploadedImages] = useState([])

  return (
    <Homepage>
      <Sidebar
        project={project}
        setProject={setProject}
        setUploadedImages={setUploadedImages}
      />

      
      <Body>
        <NavHome projectName={project.name} />
        <ImgSection uploadedImages={uploadedImages} />
      </Body>

    </Homepage>
  )
}
