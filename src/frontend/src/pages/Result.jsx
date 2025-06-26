import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import ResultSection from '../components/ResultSection'
import logo from '../logo.svg'
import { DragDropContext } from '@hello-pangea/dnd'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext';

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
  const { token } = useAuth();

  const [termicas, setTermicas] = useState([])
  const [retracoes, setRetracoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!facadeId || !token) {
      setLoading(false); // Para de carregar se não puder fazer a busca
      navigate('/')
      return;
    }

    fetch(`http://localhost:5000/classify/facades/${facadeId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({})
    })
      .then(res => {
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        const mappedTermicas = (data.termica || []).map((item, index) => {
          if (typeof item === 'string') {
            return {
              image_id: null,
              url: item,
              veredict: 'termica'
            }
          } else {
            return {
              image_id: item.image_id || null,
              url: item.url || '',
              veredict: item.veredict || 'termica'
            }
          }
        })

        const mappedRetracoes = (data.retracao || []).map((item, index) => {
          if (typeof item === 'string') {
            return {
              image_id: null,
              url: item,
              veredict: 'retracao'
            }
          } else {
            return {
              image_id: item.image_id || null,
              url: item.url || '',
              veredict: item.veredict || 'retracao'
            }
          }
        })

        setTermicas(mappedTermicas)
        setRetracoes(mappedRetracoes)
      })
      .catch(err => {
        console.error("Erro ao buscar resultados:", err)
        alert("Erro ao carregar os resultados da classificação.")
      })
      .finally(() => setLoading(false))
  }, [facadeId, token, navigate]); 
  
  const handleVoltar = () => {
    navigate('/projects')
  }

  const handleDragEnd = (result) => {
    const { source, destination } = result

    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    let sourceList = source.droppableId === 'termica' ? termicas : retracoes
    let destList = destination.droppableId === 'termica' ? termicas : retracoes

    const movedItem = sourceList[source.index]

    const newSourceList = Array.from(sourceList)
    newSourceList.splice(source.index, 1)

    const newDestList = Array.from(destList)
    newDestList.splice(destination.index, 0, movedItem)

    movedItem.veredict = destination.droppableId

    if (source.droppableId === 'termica') setTermicas(newSourceList)
    else setRetracoes(newSourceList)

    if (destination.droppableId === 'termica') setTermicas(newDestList)
    else setRetracoes(newDestList)


    if (movedItem.image_id !== null) {
      axios.put('http://localhost:5000/images/veredict', {
        image_id: movedItem.image_id,
        veredict: movedItem.veredict
      })
      .catch(err => {
        console.error("Erro ao atualizar veredito no banco:", err);
      });
    } 
  }

  if (loading) return <p style={{ padding: '2rem' }}>Carregando resultados...</p>

  return (
    <div>
      <Navbar>
        <button onClick={handleVoltar}>Voltar</button>
        <h1>Visualização de Resultados</h1>
        <img src={logo} alt='logo' width="2%" />
      </Navbar>

      {/* Adicionamos o DragDropContext da outra branch, que envolve a área de resultados. */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <ResultPage>
          {/* Usamos a versão do ResultSection que tem as props para o Drag and Drop. */}
          <ResultSection droppableId="termica" classificacao="termica" imagens={termicas} />
          <ResultSection droppableId="retracao" classificacao="retracao" imagens={retracoes} />
        </ResultPage>
      </DragDropContext>
    </div>
  )
}
