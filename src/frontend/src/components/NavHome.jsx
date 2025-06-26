import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaTrash, FaPaintBrush } from 'react-icons/fa'
import { FaSearch } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5'
import { useProject } from '../contexts/ProjectContext'
import SendPopup from '../components/SendPopup'
import DetectPopup from '../components/DetectPopup'
import ReportPopup from '../components/ReportPopup';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useSelectedImages } from '../contexts/SelectedImagesContext';
import { useAuth } from '../contexts/AuthContext';

const generatePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(data.informacoes_gerais.nome_projeto, 14, 20);

    doc.setFontSize(12);
    doc.text(`Relatório ID: ${data.informacoes_gerais.id_relatorio}`, 14, 30);
    doc.text(`Contratante: ${data.informacoes_gerais.nome_contratante}`, 14, 36);
    doc.text(`Data de emissão: ${new Date(data.informacoes_gerais.data_emissao_relatorio).toLocaleDateString()}`, 14, 42);
    doc.text(`Modelo utilizado: ${data.informacoes_gerais.modelo_utilizado}`, 14, 48);

    // Gera a primeira tabela (Resumo do Projeto)
    autoTable(doc, {
        startY: 55,
        head: [['Resumo do Projeto', 'Valor']],
        body: [
            ['Total de imagens analisadas', data.resumo_quantitativo_projeto.total_imagens_analisadas],
            ['Total de imagens com fissura', data.resumo_quantitativo_projeto.total_imagens_com_fissura],
            ['Fissuras térmicas', data.resumo_quantitativo_projeto.total_fissuras_por_tipo.fissura_termica || 0],
            ['Fissuras por retração', data.resumo_quantitativo_projeto.total_fissuras_por_tipo.fissura_retracao || 0]
        ],
    });

    // Define a posição 'y' de forma segura
    let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 55;

    // Itera sobre cada prédio
    data.detalhamento_por_predio.forEach((predio) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.text(`Prédio: ${predio.nome_predio}`, 14, y);
        y += 6;

        autoTable(doc, {
            startY: y,
            head: [['Métrica', 'Valor']],
            body: [
                ['Total de imagens', predio.resumo_quantitativo_predio.total_imagens],
                ['Com fissuras', predio.resumo_quantitativo_predio.total_imagens_com_fissura],
                ['Fissuras térmicas', predio.resumo_quantitativo_predio.fissura_termica || 0],
                ['Fissuras por retração', predio.resumo_quantitativo_predio.fissura_retracao || 0],
            ]
        });
        
        y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 5 : y;

        // Itera sobre cada fachada
        predio.fachadas_list?.forEach((fachada) => {
            if (y > 260) { doc.addPage(); y = 20; }
            doc.setFontSize(12);
            doc.text(`Fachada: ${fachada.nome_fachada}`, 16, y);
            y += 6;

            autoTable(doc, {
                startY: y,
                margin: { left: 16 },
                head: [['Métrica', 'Valor']],
                body: [
                    ['Total de imagens', fachada.resumo_quantitativo_fachada.total_imagens],
                    ['Fissuras térmicas', fachada.resumo_quantitativo_fachada.fissura_termica || 0],
                    ['Fissuras por retração', fachada.resumo_quantitativo_fachada.fissura_retracao || 0],
                ]
            });

            y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 5 : y;
        });
    });

    doc.save(`${data.informacoes_gerais.nome_projeto}.pdf`);
};

const Nav = styled.div`
    margin-left: var(--sidebar-width, 280px);
    width: calc(100vw - var(--sidebar-width, 280px));
    min-height: 18vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: var(--spacing-md);

    @media (max-width: 480px) {
        margin-left: 0;
        width: 100vw;
        flex-direction: column;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
    }

    @media (min-width: 481px) and (max-width: 768px) {
        margin-left: 200px;
        width: calc(100vw - 200px);
        padding: var(--spacing-sm);
    }

    @media (min-width: 1441px) {
        margin-left: 320px;
        width: calc(100vw - 320px);
        padding: var(--spacing-lg);
    }
`

const Infos = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
    padding-left: var(--spacing-md);

    .filtros {
        display: flex;
        flex-direction: row;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
    }

    .filtros input, select {
        border: 1px solid lightgray;
        padding: var(--spacing-xs);
        border-radius: 12px;
        font-size: var(--font-size-sm);
    }

    h3 {
        width: 80%;
        padding: var(--spacing-xs);
        font-size: var(--font-size-3xl);
        margin: 0 0 var(--spacing-sm) 0;
    }

    @media (max-width: 480px) {
        width: 100%;
        padding-left: 0;
        
        .filtros {
            flex-direction: column;
            gap: var(--spacing-xs);
        }
        
        h3 {
            width: 100%;
            font-size: var(--font-size-2xl);
            text-align: center;
        }
    }

    @media (min-width: 481px) and (max-width: 768px) {
        width: 60%;
        padding-left: var(--spacing-sm);
        
        .filtros {
            gap: var(--spacing-xs);
        }
        
        h3 {
            font-size: var(--font-size-2xl);
        }
    }

    @media (min-width: 1441px) {
        h3 {
            font-size: var(--font-size-4xl);
        }
    }
    
    .clear-filter-button {
        padding: 0.2rem 0.4rem;
        font-size: 12px;
        font-weight: 500;
        background-color: transparent;
        color: #629EBC;
        border: 1px solid #629EBC;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-left: 1rem;

        &:hover {
            background-color: #629EBC;
            color: white;
        }
    }
`   

const Botoes = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: var(--spacing-md);
    gap: var(--spacing-md);
    align-items: center;
    margin-right: var(--spacing-xl);
    max-width: 100vw;
    box-sizing: border-box;
    overflow-x: auto;

    button {
        height: 70%;
        min-height: 44px;
        border: 3px solid var(--secondary-color);
        border-radius: 15px;
        background-color: var(--primary-color);
        color: #fff;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-xs) var(--spacing-md);
        margin-right: var(--spacing-sm);
        font-size: var(--font-size-base);
        min-width: 120px;
        max-width: 100%;
        box-sizing: border-box;
        white-space: nowrap;
    }

    button:last-child {
        margin-right: 0;
    }

    button:hover {
        background-color: var(--primary-hover);
        cursor: pointer;
    }

    svg {
        font-size: var(--font-size-lg);
    }

    .send-button {
        width: 16rem;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: var(--spacing-xs) var(--spacing-md);
    }

    .send-button span {
        font-size: var(--font-size-xl);
    }

    .report-button {
        width: 10rem;
        min-width: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-xs) var(--spacing-md);
        font-size: var(--font-size-lg);
        box-sizing: border-box;
        white-space: nowrap;
    }

    /* Animação de tremor para a lixeira */
    .trash-button {
        animation: ${props => props.hasSelectedImages ? 'shake 0.5s infinite' : 'none'};
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }

    @media (max-width: 480px) {
        flex-direction: column;
        padding: var(--spacing-xs);
        gap: var(--spacing-xs);
        width: 100%;
        margin-right: 0;

        button {
            width: 100%;
            min-height: 44px;
            margin-right: 0;
        }

        .send-button, .report-button {
            width: 100%;
            min-width: 120px;
        }

        .send-button span {
            font-size: var(--font-size-base);
        }

        .report-button {
            font-size: var(--font-size-base);
        }
    }

    @media (min-width: 481px) and (max-width: 768px) {
        padding: var(--spacing-xs);
        gap: var(--spacing-xs);
        margin-right: var(--spacing-lg);

        .send-button, .report-button {
            width: 8rem;
            min-width: 120px;
        }

        .send-button span {
            font-size: var(--font-size-lg);
        }

        .report-button {
            font-size: var(--font-size-base);
        }
    }

    @media (min-width: 1441px) {
        gap: var(--spacing-lg);
        margin-right: var(--spacing-2xl, 3.5rem);

        .send-button, .report-button {
            width: 12rem;
            min-width: 140px;
        }

        .send-button span {
            font-size: var(--font-size-2xl);
        }

        .report-button {
            font-size: var(--font-size-xl);
        }
    }
`

// Popup de confirmação de exclusão
const ConfirmPopup = styled.div`
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5);
    display: flex; 
    justify-content: center; 
    align-items: center;
    z-index: 9999;

    .popup-inner {
        background: white;
        padding: var(--spacing-lg);
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        min-width: 300px;
        max-width: 90vw;
        text-align: center;
    }

    .popup-buttons {
        display: flex;
        justify-content: space-between;
        gap: var(--spacing-sm);
    }

    .popup-buttons button {
        flex: 1;
        padding: var(--spacing-xs);
        border-radius: 10px;
        border: none;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .confirm-btn {
        background-color: #dc3545;
        color: white;
    }

    .confirm-btn:hover {
        background-color: #c82333;
    }

    .cancel-btn {
        background-color: #6c757d;
        color: white;
    }

    .cancel-btn:hover {
        background-color: #545b62;
    }
`

export default function NavHome() {
    const { token } = useAuth();
    const { project } = useProject();
    const [reportableProjects, setReportableProjects] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedImages, setSelectedImages } = useSelectedImages();

    // Estado para o popup de confirmação
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const pathParts = location.pathname.split('/').filter(Boolean);

    let currentProjectId = '';
    let currentBuildingId = '';
    let currentFacadeId = '';

    const projectIndex = pathParts.indexOf('project');
    const predioIndex = pathParts.indexOf('predio');
    const fachadaIndex = pathParts.indexOf('fachada');

    if (projectIndex !== -1 && pathParts.length > projectIndex + 1) {
        currentProjectId = pathParts[projectIndex + 1];
    }

    if (predioIndex !== -1 && pathParts.length > predioIndex + 1) {
        currentBuildingId = pathParts[predioIndex + 1];
    }

    if (fachadaIndex !== -1 && pathParts.length > fachadaIndex + 1) {
        currentFacadeId = pathParts[fachadaIndex + 1];
    }

    const currentBuildingIdFromState = location.state?.buildingId;
    const finalBuildingId = currentBuildingIdFromState || currentBuildingId;

    const {
        contractors,
        orderFilter, setOrderFilter,
        contractorFilter, setContractorFilter,
        startDateFilter, setStartDateFilter,
        endDateFilter, setEndDateFilter,
        clearFilters 
    } = useProject();

    const [showPopup, setShowPopup] = useState(false)
    const [showDetectPopup, setShowDetectPopup] = useState(false);
    const [showReportPopup, setShowReportPopup] = useState(false)
    const [projects, setProjects] = useState([])
    const [buildings, setBuildings] = useState([])
    const [facades, setFacades] = useState([])

    const [selectedProject, setSelectedProject] = useState('')
    const [selectedBuilding, setSelectedBuilding] = useState('')
    const [selectedFacade, setSelectedFacade] = useState('')
    const [selectedReportProject, setSelectedReportProject] = useState('')

    useEffect(() => {
        if (token) {
            const fetchProjects = async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };

                    const response = await axios.get('http://localhost:5000/projects/', config);
                    setProjects(response.data);

                } catch (err) {
                    console.error("Erro ao buscar projetos:", err);
                    setProjects([]);
                }
            };

            fetchProjects();
        } else {
            setProjects([]);
        }
    }, [token]); 

    useEffect(() => {
        if (selectedProject) {
            const token = localStorage.getItem('jwt_token');
    
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
    
            fetch(`http://localhost:5000/building/project/${selectedProject}`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    setBuildings(data);
                })
                .catch(err => console.error("Erro ao buscar prédios:", err));
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedBuilding) {
            const token = localStorage.getItem('jwt_token');
    
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
    
            fetch(`http://localhost:5000/facade/building/${selectedBuilding}`, requestOptions)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data.fachadas)) {
                        setFacades(data.fachadas.map(f => f.name || f));
                    } else {
                        console.warn("Formato inesperado de fachadas:", data);
                        setFacades([]);
                    }
                })
                .catch(err => console.error("Erro ao buscar fachadas:", err));
        }
    }, [selectedBuilding]);

    const handleSendImages = () => {
        if (!selectedFacade) {
            alert("Selecione uma fachada antes de enviar.");
            return;
        }

        fetch(`http://localhost:5000/classify/facades/${selectedFacade}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}, 
            body: JSON.stringify({})
        })
            .then(res => {
                if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                alert("Classificação enviada com sucesso!");
                setShowPopup(false);
                navigate(`/result/${selectedFacade}`);
            })
            .catch(err => {
                console.error("Erro ao classificar:", err);
                alert("Ocorreu um erro ao enviar a classificação.");
            });
    };

    const handleOpenReportPopup = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/projects/reportable', config);
            setReportableProjects(response.data);
            setShowReportPopup(true);
        } catch (error) {
            console.error("Erro ao buscar projetos para relatório:", error);
            alert(error.response?.data?.message || "Não foi possível carregar a lista de projetos.");
        }
    };

    const handleDownloadReport = async () => {
        if (!selectedReportProject) {
            alert("Selecione um projeto para gerar o relatório.");
            return;
        }
    
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
    
            const response = await axios.get(`http://localhost:5000/projects/${selectedReportProject}/report/`, config);
            generatePDF(response.data);
    
            setShowReportPopup(false);
            setSelectedReportProject('');
        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            alert(error.response?.data?.message || "Ocorreu um erro ao gerar o relatório.");
        }
    };

    const handleSend = () => {
        if (!selectedProject) {
            alert("Selecione um projeto antes de enviar.");
            return;
        }
    
        fetch('http://localhost:5000/classify/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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
    
    const handleDetectImages = () => {
        if (!selectedFacade) {
            alert("Selecione uma fachada antes de detectar.");
            return;
        }

        fetch(`http://localhost:5000/detect/facades/${selectedFacade}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setShowDetectPopup(false);
                navigate(`/detect/${selectedFacade}`, { state: { detected: data } });
            })
            .catch(err => {
                console.error("Erro ao detectar fissuras:", err);
                alert("Erro ao enviar detecção.");
            });
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

    // Função para abrir popup de confirmação
    const handleDeleteClick = () => {
        if (selectedImages.length === 0) {
            alert('Selecione ao menos uma imagem para deletar.');
            return;
        }
        setShowConfirmDelete(true);
    };

    // Função para confirmar exclusão
    const confirmDelete = async () => {
        try {
            await axios.delete('http://localhost:5000/images/', {
                data: { image_ids: selectedImages }
            });
            alert('Imagens deletadas com sucesso!');
            setSelectedImages([]);
            setShowConfirmDelete(false);
            // Recarregar a página para atualizar a lista
            window.location.reload();
        } catch (err) {
            console.error('Erro ao deletar imagens:', err);
            alert('Erro ao deletar imagens.');
        }
    };

    const openSendPopup = () => {
        if (!currentProjectId) setSelectedProject('');
        if (!currentBuildingId) setSelectedBuilding('');
        if (!currentFacadeId) setSelectedFacade('');

        setShowPopup(true);
    };

    return (
        <Nav>
            <Infos>
                <h3>{getPageTitle()}</h3>

                {/* Renderização condicional dos filtros */}
                {location.pathname === '/projects' && (
                    <div className='filtros'>
                        <div className="filtro-item">
                            <label htmlFor="start-date">A partir de:</label>
                            <input 
                                id="start-date"
                                type='date'
                                value={startDateFilter}
                                onChange={(e) => setStartDateFilter(e.target.value)}
                            />
                        </div>
                        
                        <div className="filtro-item">
                            <label htmlFor="end-date">Até:</label>
                            <input 
                                id="end-date"
                                type='date'
                                value={endDateFilter}
                                onChange={(e) => setEndDateFilter(e.target.value)}
                            />
                        </div>

                        <select value={contractorFilter} onChange={(e) => setContractorFilter(e.target.value)}>
                            <option value="">Todos Contratantes</option>
                            {contractors.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        
                        <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)}>
                            <option value="asc">Ordem A-Z</option>
                            <option value="desc">Ordem Z-A</option>
                        </select>

                        <button onClick={clearFilters} className="clear-filter-button">
                            Limpar Filtros
                        </button>
                    </div>
                )}
            </Infos>

            <Botoes hasSelectedImages={selectedImages.length > 0}>
                <button className="trash-button" onClick={handleDeleteClick}> <FaTrash /> </button>

                <button> <FaPaintBrush /> </button>
                
                <button className='send-button' onClick={openSendPopup}><span>Classificar</span> <IoSend /></button>
                
                <button className='send-button' onClick={() => setShowDetectPopup(true)}> <span>Detectar</span> <FaSearch /> </button>
                
                <button className='report-button' onClick={handleOpenReportPopup}>Gerar Relatório</button>
            </Botoes>

            {/* Popup de confirmação de exclusão */}
            {showConfirmDelete && (
                <ConfirmPopup>
                    <div className='popup-inner'>
                        <h3>Confirmar Exclusão</h3>
                        <p>Tem certeza que deseja excluir {selectedImages.length} imagem(ns) selecionada(s)?</p>
                        <div className="popup-buttons">
                            <button className="confirm-btn" onClick={confirmDelete}>Sim, Excluir</button>
                            <button className="cancel-btn" onClick={() => setShowConfirmDelete(false)}>Cancelar</button>
                        </div>
                    </div>
                </ConfirmPopup>
            )}

            {/* Popup de Classificação */}
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
                    suggestedProject={currentProjectId ? parseInt(currentProjectId) : ''}
                    suggestedBuilding={finalBuildingId ? parseInt(finalBuildingId) : ''}
                    suggestedFacade={currentFacadeId ? parseInt(currentFacadeId) : ''}
                    onSend={handleSendImages}
                    onClose={() => setShowPopup(false)}
                />
            )}

            {/* Popup de Detecção */}
            {showDetectPopup && (
                <DetectPopup
                    projects={projects}
                    buildings={buildings}
                    facades={facades}
                    selectedProject={selectedProject}
                    selectedBuilding={selectedBuilding}
                    selectedFacade={selectedFacade}
                    setSelectedProject={setSelectedProject}
                    setSelectedBuilding={setSelectedBuilding}
                    setSelectedFacade={setSelectedFacade}
                    onSend={handleDetectImages}
                    onClose={() => setShowDetectPopup(false)}
                />
            )}

            {/* Popup de Relatório */}
            {showReportPopup && (
                <ReportPopup
                    projects={reportableProjects}
                    selectedProject={selectedReportProject}
                    setSelectedProject={setSelectedReportProject}
                    onDownload={handleDownloadReport}
                    onClose={() => setShowReportPopup(false)}
                />
            )}
        </Nav>
    );
    
}
