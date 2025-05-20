import React from 'react'
import styled from 'styled-components'
import { FaFolder } from "react-icons/fa6"
import { useProject } from '../contexts/ProjectContext'

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

    svg:hover {
        font-size: 6rem;
        color: #69758C;
    }

    button {
        height: 70%;
        border: 3px solid #0A3B4E;
        border-radius: 15px;
        background-color: #629EBC;
        color: #fff;
        font-size: 1.5rem;
    }

    button:hover {
        background-color: #3D80A3;
        cursor: pointer;
    }
`

export default function ProjectSection() {
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

    const { project } = useProject();


    return (
        <Container>
            {project.name === '' ? (
                <h2>Escolha um projeto para acessar</h2>
            ) : (
                <>
                    {fachadas.map((value, index) => (
                        <div key={index} style={{ textAlign: 'center' }}>
                            <FaFolder />
                            <p>{value}</p>
                        </div>
                    ))}
                    <button>+ Adicionar Pasta</button>
                </>
            )}
        </Container>
    )
}
