import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaTrash, FaPaintBrush } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'
import { useProject } from '../contexts/ProjectContext'
import SendPopup from '../components/SendPopup'

const Nav = styled.div`
    margin-left: 18vw;
    width: 81.2vw;
    height: 18vh;
    display: flex;
    flex-direction: row;
`

const Infos = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
    padding-left: 2vw;

    .filtros {
        display: flex;
        flex-direction: row;
        gap: .8rem;
    }

    .filtros input, select {
        border: 1px solid lightgray;
        padding: .5rem;
        border-radius: 12px;
    }

    h3 {
        width: 80%;
        padding: .5rem;
        font-size: 40px;
    }
`

const Botoes = styled.div`
    display: flex;
    flex-direction: row;
    padding: 2rem;
    gap: 2rem;

    button {
        height: 70%;
        width: 5rem;
        border: 3px solid #0A3B4E;
        border-radius: 15px;
        background-color: #629EBC;
        color: #fff;
    }

    button:hover {
        background-color: #3D80A3;
        cursor: pointer;
    }

    svg {
        font-size: 1.5rem;
    }

    .send-button {
        width: 12rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 1rem;
    }

    .send-button span {
        font-size: 36px;
    }
`

export default function NavHome() {
    const { project } = useProject();

    const [dateFilter, setDateFilter] = useState(null)
    const [optionFilter, setOptionFilter] = useState('')
    const [latitudeFilter, setLatitudeFilter] = useState('')
    const [longitudeFilter, setLongitudeFilter] = useState('')

    const [showPopup, setShowPopup] = useState(false)
    const [projects, setProjects] = useState([])
    const [buildings, setBuildings] = useState([])
    const [facades, setFacades] = useState([])

    const [selectedProject, setSelectedProject] = useState('')
    const [selectedBuilding, setSelectedBuilding] = useState('')
    const [selectedFacade, setSelectedFacade] = useState('')

    useEffect(() => {
        fetch('http://localhost:5000/projects/')
            .then(res => res.json())
            .then(data => {
                const parsed = Object.entries(data).map(([id, value]) => {
                    const [name, company] = value
                        .replace("(", "")
                        .replace(")", "")
                        .replaceAll("'", "")
                        .split(", ");
                    return {
                        id: parseInt(id),
                        name: name.trim(),
                        company: company.trim()
                    };
                });
                setProjects(parsed);
            })
            .catch(err => console.error("Erro ao buscar projetos:", err));
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetch('http://localhost:5000/building')
                .then(res => res.json())
                .then(data => {
                    const filtered = data.filter(b => b.project_id === selectedProject);
                    setBuildings(filtered);
                })
                .catch(err => console.error("Erro ao buscar prédios:", err));
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedBuilding) {
            fetch('http://localhost:5000/facade/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ building_id: selectedBuilding })
            })
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    setFacades(data.fachadas);
                })
                .catch(err => console.error("Erro ao buscar fachadas:", err));
        }
    }, [selectedBuilding]);

    const handleSend = () => {
        if (!selectedProject) {
            alert("Selecione um projeto antes de enviar.");
            return;
        }

        fetch('http://localhost:5000/classify/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                project_id: selectedProject,
                building_id: selectedBuilding,
                fachada: selectedFacade
            })
        })
            .then(res => res.json())
            .then(data => {
                alert("Classificação enviada com sucesso!");
                setShowPopup(false);
            })
            .catch(err => console.error("Erro ao classificar:", err));
    }

    return (
        <Nav>
            <Infos>
                {project.name === '' ? <h3>Adicione um projeto</h3> : <h3>{project.name}</h3>}

                <div className='filtros'>
                    <input type='date' onChange={(e) => setDateFilter(e.target.value)} />
                    <select onChange={(e) => setOptionFilter(e.target.value)} >
                        <option>Selecione uma opção</option>
                        <option>Outra opção</option>
                    </select>

                    <input type='text' placeholder='longitude' onChange={(e) => setLongitudeFilter(e.target.value)} />
                    <input type='text' placeholder='latitude' onChange={(e) => setLatitudeFilter(e.target.value)} />
                </div>
            </Infos>

            <Botoes>
                <button> <FaTrash /> </button>
                <button> <FaPaintBrush /> </button>
                <button className='send-button' onClick={() => setShowPopup(true)}> <span>Enviar</span> <IoSend /> </button>
            </Botoes>

            {showPopup && (
                <SendPopup
                    projects={projects}
                    buildings={buildings}
                    facades={facades}
                    selectedProject={selectedProject}
                    selectedBuilding={selectedBuilding}
                    selectedFacade={selectedFacade}
                    setSelectedProject={setSelectedProject}
                    setSelectedBuilding={setSelectedBuilding}
                    setSelectedFacade={setSelectedFacade}
                    onSend={handleSend}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </Nav>
    )
}
