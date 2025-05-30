import React from 'react'
import styled from 'styled-components'
import ResultSection from '../components/ResultSection'


const ResultPage = styled.div`
    display: flex;
    flex-direction: row;
`

export default function Result() {
  return (
    <ResultPage>
        <ResultSection classificacao="termica" />
        <ResultSection classificacao=" de retracao" />
    </ResultPage>
  )
}
