import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
    width: 90%;
    height: 245px;
    background-color: #8F8F8F;
    padding: 1rem;
    border-radius: 20px;

    .topo-card-img {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
    }

    p {
      margin: 0;
      margin-bottom: .5rem;
    }

    input[type=checkbox] {
      border: none;
      padding: 62px;
    }
      
`

const ImagemCard = styled.div`
  width: 100%;
  height: 70%;
  backgroung-color: #fff;
`

export default function CardImg() {
  return (
    <Card>
        <div className='topo-card-img'>
          <p width="80%">Título da imagem</p>
          <input type='checkbox' />
        </div>

        <div style={{width: '100%', height: '87%', backgroundColor: '#fff'}} />
    </Card>
  )
}
