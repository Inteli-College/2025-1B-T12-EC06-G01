import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import CardImg from './CardImg'
import axios from 'axios'

const Container = styled.div`
    width: 77vw;
    margin-left: 18vw;
    padding: 2.5rem;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
`

export default function ImgSection({ uploadedImages = [] }) {

  // ---- LÓGICA PARA PUXAR IMAGENS COM A ROTA DO BACK ----
  // const [listOfImages, setListOfImages] = useState([]);
  // let navigate = useNavigate();

  //   useEffect(() => {
  //       axios.get('http://localhost:3001/imagens').then((response) => {
  //           setListOfImages(response.data)
  //       })
  //   }, [])

  const imagens = [
    ...uploadedImages
  ]
  

  return (
    <Container>
        {imagens.map((value, key) => {
          return <CardImg key={key} img_name={value.img_name} url={value.raw_img} />
        })}
    </Container>
  )
}
