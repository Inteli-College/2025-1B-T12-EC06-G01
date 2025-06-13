import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaTrash, FaPaintBrush } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'
import { useProject } from '../contexts/ProjectContext'
import SendPopup from '../components/SendPopup'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const generatePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(data.informacoes_gerais.nome_projeto, 14, 20);

    doc.setFontSize(12);
    doc.text(`Relatório ID: ${data.informacoes_gerais.id_relatorio}`, 14, 30);
    doc.text(`Contratante: ${data.informacoes_gerais.nome_contratante}`, 14, 36);
    doc.text(`Data de emissão: ${new Date(data.informacoes_gerais.data_emissao_relatorio).toLocaleDateString()}`, 14, 42);
    doc.text(`Modelo utilizado: ${data.informacoes_gerais.modelo_utilizado}`, 14, 48);

    autoTable(doc, {
        startY: 55,
        head: [['Resumo do Projeto', 'Valor']],
        body: [
            ['Total de imagens analisadas', data.resumo_quantitativo_projeto.total_imagens_analisadas],
            ['Total de imagens com fissura', data.resumo_quantitativo_projeto.total_imagens_com_fissura],
            ['Fissuras térmicas', data.resumo_quantitativo_projeto.total_fissuras_por_tipo.fissura_termica],
            ['Fissuras por retração', data.resumo_quantitativo_projeto.total_fissuras_por_tipo.fissura_retracao]
        ],
    });

    let y = doc.previousAutoTable.finalY + 10;

    data.detalhamento_por_predio.forEach((predio) => {
        doc.setFontSize(14);
        doc.text(`Prédio: ${predio.nome_predio}`, 14, y);
        y += 6;

        autoTable(doc, {
            startY: y,
            head: [['Métrica', 'Valor']],
            body: [
                ['Total de imagens', predio.resumo_quantitativo_predio.total_imagens],
                ['Com fissuras', predio.resumo_quantitativo_predio.total_imagens_com_fissura],
                ['Fissuras térmicas', predio.resumo_quantitativo_predio.fissura_termica],
                ['Fissuras por retração', predio.resumo_quantitativo_predio.fissura_retracao],
            ]
        });

        y = doc.previousAutoTable.finalY + 5;

        predio.fachadas?.forEach((fachada) => {
            doc.setFontSize(12);
            doc.text(`Fachada: ${fachada.nome_fachada}`, 16, y);
            y += 6;

            autoTable(doc, {
                startY: y,
                margin: { left: 16 },
                head: [['Métrica', 'Valor']],
                body: [
                    ['Total de imagens', fachada.resumo_quantitativo_fachada.total_imagens],
                    ['Fissuras térmicas', fachada.resumo_quantitativo_fachada.fissura_termica],
                    ['Fissuras por retração', fachada.resumo_quantitativo_fachada.fissura_retracao],
                ]
            });

            y = doc.previousAutoTable.finalY + 5;
        });

        if (y > 260) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save(`${data.informacoes_gerais.nome_projeto}.pdf`);
};

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

    .report-button {
        width: 12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }
`

export default function NavHome() {

    const { project } = useProject();
    const location = useLocation();
    const navigate = useNavigate();

    const [dateFilter, setDateFilter] = useState(null)
    const [optionFilter, setOptionFilter] = useState('')
    const [latitudeFilter, setLatitudeFilter] = useState('')
    const [longitudeFilter, setLongitudeFilter] = useState('')

    const [showPopup, setShowPopup] = useState(false)
    const [showReportPopup, setShowReportPopup] = useState(false)
    const [projects, setProjects] = useState([])
    const [buildings, setBuildings] = useState([])
    const [facades, setFacades] = useState([])

    const [selectedProject, setSelectedProject] = useState('')
    const [selectedBuilding, setSelectedBuilding] = useState('')
    const [selectedFacade, setSelectedFacade] = useState('')
    const [selectedReportProject, setSelectedReportProject] = useState('')

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

    const handleDownloadReport = async () => {
        if (!selectedReportProject) {
            alert("Selecione um projeto antes de gerar o relatório.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/projects/${selectedReportProject}/report`);
            generatePDF(response.data);
            setShowReportPopup(false);
            setSelectedReportProject('');
        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
        }
    };

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
                navigate('/resultado');
            })
            .catch(err => console.error("Erro ao classificar:", err));
    };

    // Função para determinar o título baseado na rota atual
    const getPageTitle = () => {
        const path = location.pathname;

        if (path === '/projects') {
            return 'Escolha um projeto';
        } else if (path.includes('/predios')) {
            return 'Escolha um prédio';
        } else if (path.includes('/predio/') && path.split('/').length === 5) {
            
            return 'Escolha uma fachada';
        } else if (path.includes('/predio/') && path.split('/').length === 6) {

            return 'Visualizando fachada';
        } else if (project.name === '') {
            return 'Adicione um projeto';
        } else {
            return project.name;
        }
    };


    return (
        <Nav>
            <Infos>
                <h3>{getPageTitle()}</h3>

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
                <button className='report-button' onClick={() => setShowReportPopup(true)}>Gerar Relatório</button>
            </Botoes>

            {showReportPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '10px',
                        minWidth: '300px'
                    }}>
                        <h3>Gerar Relatório</h3>
                        <div style={{ marginTop: '1rem' }}>
                            <label>Selecione um projeto:</label>
                            <select 
                                value={selectedReportProject}
                                onChange={(e) => setSelectedReportProject(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    margin: '0.5rem 0',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px'
                                }}
                            >
                                <option value="">Selecione um projeto</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <button 
                                onClick={handleDownloadReport}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#629EBC',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Gerar Relatório
                            </button>
                            <button 
                                onClick={() => {
                                    setShowReportPopup(false);
                                    setSelectedReportProject('');
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#ccc',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
    );

}
