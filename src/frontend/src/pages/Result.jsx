import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import ResultSection from '../components/ResultSection'
import logo from '../logo.svg'

const ResultPage = styled.div`
  display: flex;
  flex-direction: row;
`

const Navbar = styled.nav`
  padding: 1rem;
  background-color: #DCDFE5;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  box-shadow: 0px 2px 6px -1px rgba(0, 0, 0, 0.1);


  button {
    padding: 1rem 2.5rem;
    border: 2px solid #0A3B4E;
    border-radius: 30px;
    background-color: #629EBC;
    color: #fff;
  }

  button:hover {
    background-color: #3D80A3;
    cursor: pointer;
  }
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
      <Navbar>
        <button onClick={handleVoltar}>Voltar</button>
        <h1>Visualização de Resultados</h1>
        <img src={logo} alt='logo' width="2%" />
      </Navbar>
      <ResultPage>
        <ResultSection classificacao="termica" imagens={termicas} />
        <ResultSection classificacao="retracao" imagens={retracoes} />
      </ResultPage>
    </div>
  )
}
