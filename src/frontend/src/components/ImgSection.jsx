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
    justify-items:center;
    gap: 2rem;
`

export default function ImgSection() {

  // ---- LÓGICA PARA PUXAR IMAGENS COM A ROTA DO BACK ----
  // const [listOfImages, setListOfImages] = useState([]);
  // let navigate = useNavigate();

  //   useEffect(() => {
  //       axios.get('http://localhost:3001/imagens').then((response) => {
  //           setListOfImages(response.data)
  //       })
  //   }, [])


  const imagens = [
    {
      "img_name": "img_001.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/1011/800/600"
    },
    {
      "img_name": "img_002.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/1025/800/600"
    },
    {
      "img_name": "img_003.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/1043/800/600"
    },
    {
      "img_name": "img_004.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/1062/800/600"
    },
    {
      "img_name": "img_005.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/1074/800/600"
    },
    {
      "img_name": "img_006.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/1084/800/600"
    },
    {
      "img_name": "img_007.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/1080/800/600"
    },
    {
      "img_name": "img_008.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/109/800/600"
    },
    {
      "img_name": "img_009.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/110/800/600"
    },
    {
      "img_name": "img_010.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/111/800/600"
    },
    {
      "img_name": "img_011.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/112/800/600"
    },
    {
      "img_name": "img_012.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/113/800/600"
    },
    {
      "img_name": "img_013.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/114/800/600"
    },
    {
      "img_name": "img_014.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/115/800/600"
    },
    {
      "img_name": "img_015.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/116/800/600"
    },
    {
      "img_name": "img_016.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/117/800/600"
    },
    {
      "img_name": "img_017.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/118/800/600"
    },
    {
      "img_name": "img_018.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/119/800/600"
    },
    {
      "img_name": "img_019.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/120/800/600"
    },
    {
      "img_name": "img_020.jpg",
      "project": "teste",
      "raw_img": "https://picsum.photos/id/121/800/600"
    }
  ]

  return (
    <Container>
        {imagens.map((value, key) => {
          return <CardImg key={key} img_name={value.img_name} url={value.raw_img} />
        })}
    </Container>
  )
}
