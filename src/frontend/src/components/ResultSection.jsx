import React from 'react'
import styled from 'styled-components'
import CardImg from './CardImg'

const Container = styled.section`
  width: 50%;
  padding: 2rem;
  background-color: ${props =>
    props.$classificacao === 'termica' ? '#DDDDDD' : '#BDBDBD'};
  text-align: center;

  h3 {
    text-transform: capitalize;
  }
`

const Images = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  gap: 2rem;
  padding: 2rem;
`

export default function ResultSection({ classificacao, imagens }) {
  // cria objetos padrão com nome e url
  const imagensFiltradas = imagens.map((url, index) => ({
    img_name: `${classificacao}_${index + 1}`,
    url: url,
  }))

  console.log(`>>> [${classificacao}] imagens:`, imagens);

  return (
    <Container $classificacao={classificacao}>
      <h3>Fissura {classificacao}</h3>
      <Images>
        {imagensFiltradas.map((value, key) => (
          <CardImg key={key} img_name={value.img_name} url={value.url} />
        ))}
      </Images>
    </Container>
  )
}
