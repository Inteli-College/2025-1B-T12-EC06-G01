import React from 'react'
import Sidebar from '../components/Sidebar'
import ImgSection from '../components/ImgSection'
import styled from 'styled-components'

const Homepage = styled.div`
  display: flex;
  flex-direction: row;
`

export default function Home() {
  return (
    <Homepage>
      <Sidebar />
      <ImgSection />
    </Homepage>
  )
}
