import React from 'react'
import styled from 'styled-components'
import { FaFolder } from "react-icons/fa6"

const Container = styled.div`
    width: 77vw;
    margin-left: 18vw;
    padding: 2.5rem;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 2rem;

    svg {
        font-size: 5rem;
        color: #969FB0;
    }

    zsvg:hover {
        font-size: 6rem;
        color: #69758C;
    }
`

export default function ProjectSection({ projectName }) {
      // ---- LÓGICA PARA PUXAR IMAGENS COM A ROTA DO BACK ----
  // const [listOfBuildings, setListOfBuildings] = useState([]);
  // let navigate = useNavigate();

  //   useEffect(() => {
  //       axios.get('http://localhost:3001/predios').then((response) => {
  //           setListOfBuildings(response.data)
  //       })
  //   }, [])


  //lista de fachadas criada provisóriamente para teste
    const fachadas = [
        "Fachada Leste",
        "Fachada Oeste",
        "Fachada Norte",
        "Fachada Sul"
      ]
      

  return (
    <Container>
        {projectName === '' ? <h2>Escolha um projeto para acessar</h2> : fachadas.map((value) => {
            return(
                <div style={{textAlign: 'center'}}>
                    <FaFolder />
                    <p>{value}</p>
                </div>
            )
        })}
    </Container>
  )
}
