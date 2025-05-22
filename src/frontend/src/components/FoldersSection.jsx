import React from 'react';
import styled from 'styled-components';
import { FaFolder } from "react-icons/fa6";
// import { useProject } from '../contexts/ProjectContext'; // Temporariamente não usado
import { useNavigate } from 'react-router-dom';

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
`;

export default function FoldersSection({ folders, path }) {
    // const { project } = useProject(); // TEMPORARIAMENTE COMENTADO. TIRAR COMENTARIO QUANDO ADICIONAR O PROJECT
    let navigate = useNavigate();

    if (!Array.isArray(folders)) {
        // console.warn("FoldersSection: 'folders' prop is not an array or is undefined.", folders);
        // return <div>Carregando pastas...</div>; // Ou outra indicação de carregamento/erro
    }
    
    return (
        <Container>
            {/* {project.name === '' ? ( // CONDIÇÃO DO PROJETO TEMPORARIAMENTE REMOVIDA
                <h2>Escolha um projeto para acessar</h2>
            ) : ( */}
                <>
                    {/* Verifica se 'folders' existe e é um array antes de checar o length */}
                    {(!folders || folders.length === 0) && <h2>Nenhum prédio encontrado.</h2>}
                    {folders && folders.map((building) => (
                        <div key={building.id} style={{ textAlign: 'center' }}>
                            <FaFolder onClick={() => navigate(`${path}/${encodeURIComponent(building.predio)}`)} />
                            <p>{building.predio}</p>
                        </div>
                    ))}
                    <button>+ Adicionar Pasta</button>
                </>
            {/* )} */}
        </Container>
    );
}