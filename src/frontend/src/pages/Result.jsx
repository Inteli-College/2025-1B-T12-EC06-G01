import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import ResultSection from '../components/ResultSection'

const ResultPage = styled.div`
  display: flex;
  flex-direction: row;
`

export default function Result() {
  const navigate = useNavigate()
  const { facadeId } = useParams()

  const [termicas, setTermicas] = useState([])
  const [retracoes, setRetracoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!facadeId) {
      alert("ID da fachada não encontrado.")
      navigate('/')
      return
    }

    fetch(`http://localhost:5000/classify/facades/${facadeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
      .then(res => {
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setTermicas(data.termica || [])
        setRetracoes(data.retracao || [])
      })
      .catch(err => {
        console.error("Erro ao buscar resultados:", err)
        alert("Erro ao carregar os resultados da classificação.")
      })
      .finally(() => setLoading(false))
  }, [facadeId])

  const handleVoltar = () => {
    navigate('/')
  }

  if (loading) return <p style={{ padding: '2rem' }}>Carregando resultados...</p>

  return (
    <div>
      <nav style={{ padding: '1rem' }}>
        <button onClick={handleVoltar}>Voltar</button>
      </nav>
      <ResultPage>
        <ResultSection classificacao="termica" imagens={termicas} />
        <ResultSection classificacao="retracao" imagens={retracoes} />
      </ResultPage>
    </div>
  )
}
