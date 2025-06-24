import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaFolder } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AddFolderPopup from './AddFolderPopup';

const Container = styled.div`
    width: calc(100vw - var(--sidebar-width, 280px));
    margin-left: var(--sidebar-width, 280px);
    padding: var(--spacing-xl);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
    max-width: 100%;

    @media (max-width: 480px) {
        margin-left: 0;
        width: 100vw;
        padding: var(--spacing-md);
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: var(--spacing-md);
    }

    @media (min-width: 481px) and (max-width: 768px) {
        margin-left: 200px;
        width: calc(100vw - 200px);
        padding: var(--spacing-lg);
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    @media (min-width: 769px) and (max-width: 1024px) {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    @media (min-width: 1025px) and (max-width: 1440px) {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    @media (min-width: 1441px) {
        margin-left: 320px;
        width: calc(100vw - 320px);
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-xl);
    }
`;

const FolderCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    padding: var(--spacing-md);
    border-radius: 15px;
    transition: all 0.3s ease;
    background-color: #f8f9fa;
    border: 2px solid transparent;
    
    &:hover {
        background-color: #e9ecef;
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    svg {
        font-size: 4rem;
        color: #969FB0;
        transition: all 0.3s ease;
        margin-bottom: var(--spacing-sm);
    }
    
    &:hover svg {
        font-size: 4.5rem;
        color: #69758C;
    }
    
    p {
        margin: var(--spacing-xs) 0;
        font-weight: bold;
        font-size: var(--font-size-base);
        color: var(--text-color);
    }

    @media (max-width: 768px) {
        padding: var(--spacing-sm);
        
        svg {
            font-size: 3rem;
        }
        
        &:hover svg {
            font-size: 3.5rem;
        }
        
        p {
            font-size: var(--font-size-sm);
        }
    }

    @media (min-width: 1441px) {
        padding: var(--spacing-lg);
        
        svg {
            font-size: 5rem;
        }
        
        &:hover svg {
            font-size: 5.5rem;
        }
        
        p {
            font-size: var(--font-size-lg);
        }
    }
`;

const LoadingMessage = styled.h2`
    grid-column: 1 / -1;
    text-align: center;
    color: var(--text-muted);
    font-size: var(--font-size-xl);
    padding: var(--spacing-xl);
`;

const ErrorMessage = styled.h2`
    grid-column: 1 / -1;
    text-align: center;
    color: #d32f2f;
    font-size: var(--font-size-xl);
    padding: var(--spacing-xl);
`;

const AddButton = styled.button`
    height: 100%;
    min-height: 120px;
    border: 3px solid var(--secondary-color);
    border-radius: 15px;
    background-color: var(--primary-color);
    color: #fff;
    font-size: var(--font-size-lg);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md);
    
    &:hover {
        background-color: var(--primary-hover);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
        min-height: 100px;
        font-size: var(--font-size-base);
        padding: var(--spacing-sm);
    }

    @media (min-width: 1441px) {
        min-height: 150px;
        font-size: var(--font-size-xl);
        padding: var(--spacing-lg);
    }
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
    folderId
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
    const [showPopup, setShowPopup] = useState(false)

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
                setShowPopup(false);
                fetchFolders();
                window.location.reload();
            })
            .catch(err => {
                console.error("Erro ao criar pasta:", err);
            });
    };

    return (
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
                    <FaFolder />
                    <p>{folder[folderNameField]}</p>
                </FolderCard>
            ))}



            <AddButton onClick={() => setShowPopup(true)}>+ Adicionar Pasta</AddButton>

            {showPopup && (
                <AddFolderPopup
                    pasta={pasta}
                    setPasta={setPasta}
                    onSend={handleAddFolder}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </Container>
    );
}