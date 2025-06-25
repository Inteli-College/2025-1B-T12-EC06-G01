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
import { useAuth } from '../contexts/AuthContext';

// Coloque este objeto dentro do seu componente NavHome.jsx, antes da declaração do return.
const mockReportData = {
    informacoes_gerais: {
      id_relatorio: "REL-2025-001",
      nome_projeto: "Projeto Demo Shopping Center",
      nome_contratante: "IPT - Instituto de Pesquisas Tecnológicas",
      data_emissao_relatorio: new Date().toISOString(),
      modelo_utilizado: "Modelo de Fissuras v2.1"
    },
    resumo_quantitativo_projeto: {
      total_imagens_analisadas: 350,
      total_imagens_com_fissura: 85,
      total_fissuras_por_tipo: {
        fissura_termica: 40,
        fissura_retracao: 45
      }
    },
    detalhamento_por_predio: [
      {
        nome_predio: "Bloco A - Lojas",
        resumo_quantitativo_predio: {
          total_imagens: 200,
          total_imagens_com_fissura: 50,
          fissura_termica: 25,
          fissura_retracao: 25
        },
        fachadas: [
          {
            nome_fachada: "Fachada Norte",
            resumo_quantitativo_fachada: {
              total_imagens: 100,
              fissura_termica: 15,
              fissura_retracao: 10
            }
          },
          {
            nome_fachada: "Fachada Leste",
            resumo_quantitativo_fachada: {
              total_imagens: 100,
              fissura_termica: 10,
              fissura_retracao: 15
            }
          }
        ]
      },
      {
        nome_predio: "Bloco B - Estacionamento",
        resumo_quantitativo_predio: {
          total_imagens: 150,
          total_imagens_com_fissura: 35,
          fissura_termica: 15,
          fissura_retracao: 20
        },
        fachadas: [
          {
            nome_fachada: "Fachada Sul",
            resumo_quantitativo_fachada: {
              total_imagens: 150,
              fissura_termica: 15,
              fissura_retracao: 20
            }
          }
        ]
      }
    ]
  };

const generatePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(data.informacoes_gerais.nome_projeto, 14, 20);

    doc.setFontSize(12);
    doc.text(`Relatório ID: ${data.informacoes_gerais.id_relatorio}`, 14, 30);
    doc.text(`Contratante: ${data.informacoes_gerais.nome_contratante}`, 14, 36);
    doc.text(`Data de emissão: ${new Date(data.informacoes_gerais.data_emissao_relatorio).toLocaleDateString()}`, 14, 42);
    doc.text(`Modelo utilizado: ${data.informacoes_gerais.modelo_utilizado}`, 14, 48);

    // --- INÍCIO DA CORREÇÃO ---

    // 1. Gera a primeira tabela (Resumo do Projeto)
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

    // 2. Define a posição 'y' de forma segura
    // Se a tabela anterior foi desenhada, usa a sua posição final. Senão, começa a partir de um valor padrão.
    let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 55;

    // 3. Itera sobre cada prédio, aplicando a mesma lógica segura
    data.detalhamento_por_predio.forEach((predio) => {
        if (y > 260) { doc.addPage(); y = 20; } // Adiciona nova página se necessário
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
        
        y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 5 : y;

        // 4. Itera sobre cada fachada, com a mesma lógica segura
        predio.fachadas?.forEach((fachada) => {
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
                    ['Fissuras térmicas', fachada.resumo_quantitativo_fachada.fissura_termica],
                    ['Fissuras por retração', fachada.resumo_quantitativo_fachada.fissura_retracao],
                ]
            });

            y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 5 : y;
        });
    });

    // --- FIM DA CORREÇÃO ---

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
    background-color: transparent; /* Fundo transparente */
    color: #629EBC;                /* Cor do texto igual à dos botões principais */
    border: 1px solid #629EBC;      /* Borda com a cor principal */
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 1rem;

    &:hover {
        background-color: #629EBC; /* Fundo preenche no hover */
        color: white;             /* Texto fica branco no hover */
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

export default function NavHome() {
    const { token } = useAuth(); // Pega o token do nosso contexto global
    const { project } = useProject();
    const location = useLocation();
    const navigate = useNavigate();

    const pathParts = location.pathname.split('/').filter(Boolean); // remove strings vazias

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
    const [showReportPopup, setShowReportPopup] = useState(false)
    const [projects, setProjects] = useState([])
    const [buildings, setBuildings] = useState([])
    const [facades, setFacades] = useState([])

    const [selectedProject, setSelectedProject] = useState('')
    const [selectedBuilding, setSelectedBuilding] = useState('')
    const [selectedFacade, setSelectedFacade] = useState('')
    const [selectedReportProject, setSelectedReportProject] = useState('')

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Pega o token do localStorage
                const token = localStorage.getItem('jwt_token');
                if (!token) {
                    console.error("Token não encontrado, não é possível buscar projetos.");
                    // O PrivateRoute deve eventualmente lidar com isso, mas é uma boa verificação
                    return;
                }

                // Configura o cabeçalho de autorização
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // Busca os projetos na API COM o token
                const response = await axios.get('http://localhost:5000/projects', config);
                setProjects(response.data); // Popula o estado com os projetos

            } catch (err) {
                console.error("Erro ao buscar projetos:", err);
                // Você pode definir uma mensagem de erro aqui, se desejar
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            // Pega o token do localStorage
            const token = localStorage.getItem('jwt_token');
    
            const requestOptions = {
                method: 'GET', // Embora GET seja o padrão, é bom ser explícito
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
            body: JSON.stringify({
                // opcional: filtros de data aqui:
                // start_date: "2025-06-01",
                // end_date: "2025-06-13"
            })
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

    const handleOpenReportPopup = () => {
        setShowReportPopup(true);
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
    
            const response = await axios.get(`http://localhost:5000/projects/${selectedReportProject}/report`, config);
    
            // Se a chamada for bem-sucedida, usa os dados recebidos para gerar o PDF
            // (Assumindo que você tem uma função generatePDF(data) disponível)
            generatePDF(response.data);
    
            setShowReportPopup(false); // Fecha o popup
            setSelectedReportProject(''); // Limpa a seleção
        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            // Exibe a mensagem de erro amigável do backend, se disponível
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
                                
                                {/* Input de Data de Início Corrigido */}
                                <div className="filtro-item">
                    <label htmlFor="start-date">A partir de:</label>
                    <input 
                        id="start-date"
                        type='date'
                        value={startDateFilter} // de volta para 'value'
                        onChange={(e) => setStartDateFilter(e.target.value)} // de volta para 'onChange'
                    />
                    </div>
                    
                    <div className="filtro-item">
                    <label htmlFor="end-date">Até:</label>
                    <input 
                        id="end-date"
                        type='date'
                        value={endDateFilter} // de volta para 'value'
                        onChange={(e) => setEndDateFilter(e.target.value)} // de volta para 'onChange'
                    />
                    </div>

                        {/* Os selects podem continuar com onChange, pois a seleção é uma ação única */}
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

            <Botoes>
                <button> <FaTrash /> </button>
                <button> <FaPaintBrush /> </button>
                <button className='send-button' onClick={openSendPopup}><span>Classificar</span> <IoSend /></button>

                <button className='report-button' onClick={() => setShowReportPopup(true)}>Gerar Relatório</button>
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
                    suggestedProject={currentProjectId ? parseInt(currentProjectId) : ''}
                    suggestedBuilding={finalBuildingId ? parseInt(finalBuildingId) : ''}
                    suggestedFacade={currentFacadeId ? parseInt(currentFacadeId) : ''}
                    onSend={handleSendImages}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </Nav>
    );

}
