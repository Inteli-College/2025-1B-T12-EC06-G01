import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaTrash, FaPaintBrush } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'
import { useProject } from '../contexts/ProjectContext'
import axios from 'axios'

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
        gap: .8rem
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

const Popup = styled.div`
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.4);
    display: flex; justify-content: center; align-items: center;
    z-index: 9999;

    .popup-inner {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-width: 400px;
    }

    select {
        padding: .5rem;
        border-radius: 10px;
        border: 1px solid gray;
    }

    .popup-buttons {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }

    .popup-buttons button {
        flex: 1;
        padding: .5rem;
        border-radius: 10px;
        border: none;
        background-color: #629EBC;
        color: white;
        font-weight: bold;
        cursor: pointer;
    }

    .popup-buttons button:hover {
        background-color: #3D80A3;
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
                    setFacades(data.fachadas); // só o array de strings
                })
                .catch(err => console.error("Erro ao buscar fachadas:", err));
        }
    }, [selectedBuilding]);


    const handleSend = () => {
        if (!selectedProject) {
            alert("Selecione um projeto antes de enviar.")
            return
        }

        fetch('http://localhost:5000/classify/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                project_id: selectedProject
                // Futuramente: building_id: selectedBuilding, fachada: selectedFacade
            })
        })
            .then(res => res.json())
            .then(data => {
                alert("Classificação enviada com sucesso!");
                setShowPopup(false);
            })
            .catch(err => console.error("Erro ao classificar:", err))
        
        window.alert()
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
                <Popup>
                    <div className="popup-inner">
                        <h2>Enviar Imagens para Classificação</h2>

                        <select onChange={(e) => setSelectedProject(parseInt(e.target.value))} value={selectedProject}>
                            <option value=''>Selecione o projeto</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        <select onChange={(e) => setSelectedBuilding(parseInt(e.target.value))} value={selectedBuilding} disabled={!selectedProject}>
                            <option value=''>Selecione o prédio</option>
                            {buildings.map(b => (
                                <option key={b.id} value={b.id}>{b.predio}</option>
                            ))}
                        </select>

                        <select onChange={(e) => setSelectedFacade(e.target.value)} value={selectedFacade} disabled={!selectedBuilding}>
                            <option value=''>Selecione a fachada</option>
                            {facades.map((f, index) => (
                                <option key={index} value={f}>{f}</option>
                            ))}
                        </select>

                        <div className="popup-buttons">
                            <button onClick={handleSend}>Enviar</button>
                            <button onClick={() => setShowPopup(false)}>Cancelar</button>
                        </div>
                    </div>
                </Popup>
            )}
        </Nav>
    )
}
