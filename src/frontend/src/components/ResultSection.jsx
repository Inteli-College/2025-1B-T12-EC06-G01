import React from 'react'
import styled from 'styled-components'
import CardImg from './CardImg'
import { Droppable, Draggable } from '@hello-pangea/dnd'

const Container = styled.section`
  width: 50%;
  padding: 2rem;
  background-color: ${props =>
    props.$classificacao === 'termica' ? '#D3E2EF' : '#BCCBD8'};
  text-align: center;

  h3 {
    text-transform: capitalize;
  }
`

const Images = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
`

export default function ResultSection({ classificacao, imagens, droppableId }) {
  const imagensFiltradas = imagens.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `${droppableId}-${index}`,
        img_name: `${classificacao}_${index + 1}`,
        url: item
      }
    } else {
      return {
        id: `${droppableId}-${index}`,
        img_name: `${classificacao}_${index + 1}`,
        url: item.url || ''
      }
    }
  })

  return (
    <Container $classificacao={classificacao}>
      <h3>Fissura {classificacao}</h3>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <Images
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {imagensFiltradas.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                    }}
                  >
                    <CardImg img_name={item.img_name} url={item.url} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Images>
        )}
      </Droppable>
    </Container>
  )
}
