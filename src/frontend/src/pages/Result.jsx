import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import ResultSection from '../components/ResultSection'

const ResultPage = styled.div`
    display: flex;
    flex-direction: row;
`

const imagens = [
  { img_name: "FR1.png", project: "teste", raw_img: "/images/FR1.png" },
  { img_name: "FR2.png", project: "teste", raw_img: "/images/FR2.PNG" },
  { img_name: "FR3.PNG", project: "teste", raw_img: "/images/FR3.PNG" },
  { img_name: "FR4.PNG", project: "teste", raw_img: "/images/FR4.PNG" },
  { img_name: "FR5.PNG", project: "teste", raw_img: "/images/FR5.PNG" },
  { img_name: "FR6.PNG", project: "teste", raw_img: "/images/FR6.PNG" },
  { img_name: "FR7.PNG", project: "teste", raw_img: "/images/FR7.PNG" },
  { img_name: "FR8.PNG", project: "teste", raw_img: "/images/FR8.PNG" },
  { img_name: "FR9.PNG", project: "teste", raw_img: "/images/FR9.PNG" },
  { img_name: "FR10.PNG", project: "teste", raw_img: "/images/FR10.PNG" },
  { img_name: "FR11.PNG", project: "teste", raw_img: "/images/FR11.PNG" },
  { img_name: "FR12.PNG", project: "teste", raw_img: "/images/FR12.PNG" },
  { img_name: "FR13.PNG", project: "teste", raw_img: "/images/FR13.PNG" },
  { img_name: "FR14.PNG", project: "teste", raw_img: "/images/FR14.PNG" },
  { img_name: "FR15.PNG", project: "teste", raw_img: "/images/FR15.PNG" },
  { img_name: "FR16.PNG", project: "teste", raw_img: "/images/FR16.PNG" },
  { img_name: "FR17.PNG", project: "teste", raw_img: "/images/FR17.PNG" },
  { img_name: "FR18.PNG", project: "teste", raw_img: "/images/FR18.PNG" },
  { img_name: "FR19.PNG", project: "teste", raw_img: "/images/FR19.PNG" },
  { img_name: "FR20.PNG", project: "teste", raw_img: "/images/FR20.PNG" },
  { img_name: "FT1.PNG", project: "teste", raw_img: "/images/FT1.PNG" },
  { img_name: "FT2.PNG", project: "teste", raw_img: "/images/FT2.PNG" },
  { img_name: "FT3.PNG", project: "teste", raw_img: "/images/FT3.PNG" },
  { img_name: "FT4.PNG", project: "teste", raw_img: "/images/FT4.PNG" },
  { img_name: "FT5.PNG", project: "teste", raw_img: "/images/FT5.PNG" },
  { img_name: "FT6.PNG", project: "teste", raw_img: "/images/FT6.PNG" },
  { img_name: "FT7.PNG", project: "teste", raw_img: "/images/FT7.PNG" },
  { img_name: "FT8.PNG", project: "teste", raw_img: "/images/FT8.PNG" },
  { img_name: "FT9.PNG", project: "teste", raw_img: "/images/FT9.PNG" },
  { img_name: "FT10.PNG", project: "teste", raw_img: "/images/FT10.PNG" },
  { img_name: "FT11.PNG", project: "teste", raw_img: "/images/FT11.PNG" },
  { img_name: "FT12.PNG", project: "teste", raw_img: "/images/FT12.PNG" },
  { img_name: "FT13.PNG", project: "teste", raw_img: "/images/FT13.PNG" },
  { img_name: "FT14.PNG", project: "teste", raw_img: "/images/FT14.PNG" },
  { img_name: "FT15.PNG", project: "teste", raw_img: "/images/FT15.PNG" },
  { img_name: "FT16.PNG", project: "teste", raw_img: "/images/FT16.PNG" },
  { img_name: "FT17.PNG", project: "teste", raw_img: "/images/FT17.PNG" },
  { img_name: "FT18.PNG", project: "teste", raw_img: "/images/FT18.PNG" },
  { img_name: "FT19.PNG", project: "teste", raw_img: "/images/FT19.PNG" },
  { img_name: "FT20.PNG", project: "teste", raw_img: "/images/FT20.PNG" }
];

const imagensTermicas = imagens.filter(img => img.img_name.toUpperCase().startsWith('FT'))
const imagensRetracao = imagens.filter(img => img.img_name.toUpperCase().startsWith('FR'))

export default function Result() {
  const navigate = useNavigate()

  const handleVoltar = () => {
    navigate('/')
  }

  return (
    <div>
      <nav style={{ padding: '1rem' }}>
        <button onClick={handleVoltar}>Voltar</button>
      </nav>
      <ResultPage>
        <ResultSection classificacao="termica" imagens={imagensTermicas} />
        <ResultSection classificacao="retracao" imagens={imagensRetracao} />
      </ResultPage>
    </div>
  )
}
