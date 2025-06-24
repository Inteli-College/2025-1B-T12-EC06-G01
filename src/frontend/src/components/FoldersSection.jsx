import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaFolder } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AddFolderPopup from './AddFolderPopup';
import EditFolderPopup from './EditFolderPopup';

const Page = styled.div`
    margin-left: 18vw;
    
    .btn-section {
        padding: 2rem 2.5rem 0 2.5rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .btn-section button {
        width: 20%;
        height: 20px;
        border-radius: 10px;
        background-color: #629EBC;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 3px solid #145E7A;
        color: #fff;
        font-size: 16px;
        padding: 1rem;
        transition: background-color 0.3s ease;
    } 

    button:hover {
        background-color: #3D80A3; 
        cursor: pointer; 
    }
`;

const Container = styled.div`
    width: 77vw;
    padding: 2.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 2rem;
`;

const FolderCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;

    .folder-icon svg {
        font-size: 5rem;
        color: #969FB0;
        transition: all 0.3s ease;
    }

    .folder-icon:hover svg {
        font-size: 6rem;
        color: #69758C;
    }

    p {
        display: flex;
        margin: 0.5rem 0;
        font-weight: bold;
        text-transform: capitalize;
        align-items: center;
        gap: .3rem;
    }
`;

const Edit = styled.div`
    svg {
        font-size: 1.5rem;
    }

    &:hover svg {
        font-size: 2rem;
    }
`;

const LoadingMessage = styled.h2`
    grid-column: span 6;
    text-align: center;
    color: #666;
`;

const ErrorMessage = styled.h2`
    grid-column: span 6;
    text-align: center;
    color: #d32f2f;
`;


/**
 * FoldersSection - Componente genérico para exibir pastas
 * @param {string} path - Caminho base para navegação ao clicar em uma pasta
 * @param {Array} folders - Array de pastas a serem exibidas 
 * @param {string} apiUrl - URL da API para buscar as pastas 
 * @param {string} folderNameField - Nome do campo que contém o nome da pasta (default: "predio")
 * @param {string} folderIdField - Nome do campo que contém o ID da pasta (default: "id")
 * @param {string} addUrl - URL da API para adicionar pastas
 */
export default function FoldersSection({
    path,
    folders: propFolders,
    apiUrl,
    folderNameField = "predio",
    folderIdField = "id",
    addUrl,
    folderId,
    btnLabel
}) {
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

    const fetchFolders = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(apiUrl);
            const data = response.data;

            let finalFolders = [];

            // Caso especial para API de fachadas
            if (data.fachadas && Array.isArray(data.fachadas)) {
                const isStringList = typeof data.fachadas[0] === "string";

                finalFolders = isStringList
                    ? data.fachadas.map((nome, index) => ({
                        [folderIdField]: index,
                        [folderNameField]: nome
                    }))
                    : data.fachadas.map((fachada) => ({
                        [folderIdField]: fachada.id,
                        [folderNameField]: fachada.name
                    }));
            }
            else if (Array.isArray(data)) {
                finalFolders = data;
            } else {
                console.error("Formato de resposta inesperado:", data);
            }
            setFolders(finalFolders);
        } catch (err) {
            console.error("Erro ao buscar pastas:", err);
            setError(err);
            setFolders([]);
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl, folderIdField, folderNameField]);

    useEffect(() => {
        // Se recebemos folders como prop, usamos eles diretamente
        if (propFolders) {
            // Se for array de strings, convertemos para objetos
            if (propFolders.length > 0 && typeof propFolders[0] === 'string') {
                const formattedFolders = propFolders.map((name, index) => {
                    const folder = {};
                    folder[folderIdField] = index;
                    folder[folderNameField] = name;
                    return folder;
                });
                setFolders(formattedFolders);
            } else {
                // Se já for array de objetos
                setFolders(propFolders);
            }
            return; // Não fazemos fetch se temos folders
        }

        // Se não temos folders, mas temos URL da API, fazemos fetch
        if (apiUrl) {
            fetchFolders();
        }
    }, [propFolders, apiUrl, folderIdField, folderNameField, fetchFolders]);

    const [pasta, setPasta] = useState('');
    const { projectId } = useParams();
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);


    //Lógica para adição de uma nova pasta
    const handleAddFolder = () => {
        if (pasta === "") {
            alert("Dê um nome para a pasta.");
            return;
        }

        let folderInfos = {};

        if (addUrl === "http://localhost:5000/building/") {
            folderInfos = {
                project_id: projectId,
                predio: pasta,
                latitude: null,
                longitude: null
            };
        } else if (addUrl === "http://localhost:5000/facade/") {
            folderInfos = {
                building_id: folderId,
                name: pasta
            };
        }

        axios.post(addUrl, folderInfos, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                alert("Pasta criada com sucesso!");
                setShowAddPopup(false);
                fetchFolders();
                window.location.reload();
            })
            .catch(err => {
                console.error("Erro ao criar pasta:", err);
            });
    };

    const handleEditFolderName = () => {
    if (pasta === "") {
        alert("Dê um nome para a pasta.");
        return;
    }

    let folderInfos = {};

    if (addUrl === "http://localhost:5000/building/") {
        folderInfos = {
            building_id: selectedFolder[folderIdField],
            building_name: pasta
        };
    } else if (addUrl === "http://localhost:5000/facade/") {
        folderInfos = {
            facade_id: selectedFolder[folderIdField],
            facade_name: pasta
        };
    }

    axios.put(addUrl, folderInfos, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        alert("Pasta atualizada com sucesso!");
        setShowEditPopup(false);
        fetchFolders();
        window.location.reload();
    })
    .catch(err => {
        console.error("Erro ao atualizar pasta:", err);
    });
};

    return (
        <Page>
            <div className='btn-section'>
                <button onClick={() => setShowAddPopup(true)}>+ Adicionar {btnLabel}</button>
            </div>

            <Container>
                {isLoading && <LoadingMessage>Carregando pastas...</LoadingMessage>}
                {error && <ErrorMessage>Erro ao carregar dados: {error.message}</ErrorMessage>}

                {!isLoading && !error && (!folders || folders.length === 0) &&
                    <LoadingMessage>Nenhuma pasta encontrada.</LoadingMessage>}

                {!isLoading && !error && folders && folders.map((folder) => (
                    <FolderCard
                        key={folder[folderIdField]}
                        onClick={() => {
                            const encodedName = encodeURIComponent(folder[folderNameField]);

                            if (addUrl === "http://localhost:5000/facade/") {
                                navigate(`${path}/${encodedName}`, {
                                    state: { fachadaId: folder[folderIdField], buildingId: folderId }
                                });
                            } else if (addUrl === "http://localhost:5000/building/") {
                                navigate(`${path}/${encodedName}`);
                            }
                        }}
                    >
                        <div className="folder-icon">
                            <FaFolder />
                        </div>
                        <p>{folder[folderNameField]}</p>
                        <Edit>
                            <MdOutlineEdit onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFolder(folder); // guardamos a pasta clicada
                                setPasta(folder[folderNameField]); // preenche o input com o nome atual
                                setShowEditPopup(true);
                            }} />

                        </Edit>
                    </FolderCard>
                ))}

                {showEditPopup && (
                    <EditFolderPopup
                        pasta={pasta}
                        setPasta={setPasta}
                        onSend={handleEditFolderName}
                        onClose={() => setShowEditPopup(false)}
                    />
                )}

                {showAddPopup && (
                    <AddFolderPopup
                        pasta={pasta}
                        setPasta={setPasta}
                        onSend={handleAddFolder}
                        onClose={() => setShowAddPopup(false)}
                    />
                )}
            </Container>
        </Page>
    );
}
