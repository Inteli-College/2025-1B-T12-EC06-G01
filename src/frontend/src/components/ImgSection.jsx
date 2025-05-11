import React from 'react'
import styled from 'styled-components'
import CardImg from './CardImg'

const Container = styled.div`
    width: 82vw;
    margin-left: 18vw;
    padding: 2.5rem;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2.5rem;
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
