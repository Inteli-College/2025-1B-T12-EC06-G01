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
        font-size: 30px;
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
        const fetchProjects = async () => {
            try {
                // Usamos axios para consistência e o URL com a barra no final
                const response = await axios.get('http://localhost:5000/projects/');
                // A resposta (response.data) já é o array de projetos que queremos.
                setProjects(response.data);
            } catch (err) {
                console.error("Erro ao buscar projetos:", err);
            }
        };
    
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetch(`http://localhost:5000/building/project/${selectedProject}`)
                .then(res => res.json())
                .then(data => {
                    setBuildings(data);
                })
                .catch(err => console.error("Erro ao buscar prédios:", err));
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedBuilding) {
            fetch(`http://localhost:5000/facade/building/${selectedBuilding}`)
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
            headers: { 'Content-Type': 'application/json' },
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

    const handleDownloadReport = async () => {
    // A seleção de projeto pode ser ignorada para o mock,
    // mas vamos manter a validação para simular o fluxo completo.
    if (!selectedReportProject) {
        alert("Para a demo: Selecione qualquer projeto para continuar.");
        //return; // Pode comentar o return para a demo funcionar mesmo sem seleção
    }

    console.log("Gerando relatório com dados MOCKADOS para apresentação...");

    // 1. Chame a função generatePDF diretamente com os dados mockados
    generatePDF(mockReportData);

    // 2. Comente ou remova a chamada à API original
    /*
    try {
        const response = await axios.get(`http://localhost:5000/projects/${selectedReportProject}/report`);
        generatePDF(response.data);
        setShowReportPopup(false);
        setSelectedReportProject('');
    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
    }
    */

    // Opcional: pode fechar o popup após gerar o PDF de demo
    setShowReportPopup(false);
    setSelectedReportProject('');
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
                    onSend={handleSendImage}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </Nav>
    );

}
