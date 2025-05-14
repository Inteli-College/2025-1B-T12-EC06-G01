import React from 'react'
import styled from 'styled-components'
import CardImg from './CardImg'

const Container = styled.div`
    width: 77vw;
    margin-left: 18vw;
    padding: 2.5rem;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
`

export default function ImgSection() {
  return (
    <Container>
        <CardImg />
        <CardImg />
        <CardImg />
        <CardImg />
        <CardImg />
        <CardImg />
        <CardImg />
        <CardImg />
        <CardImg />
        <CardImg />
        <CardImg />
        <CardImg />
    </Container>
  )
}
