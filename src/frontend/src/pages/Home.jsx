import React from 'react'
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
  return (
    <Homepage>
      <Sidebar />
      <Body>
        <NavHome />
        <ImgSection />
      </Body>

    </Homepage>
  )
}
