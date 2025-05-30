import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaFolder } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
    width: 77vw;
    margin-left: 18vw;
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
    
    svg {
        font-size: 5rem;
        color: #969FB0;
        transition: all 0.3s ease;
    }
    
    &:hover svg {
        font-size: 6rem;
        color: #69758C;
    }
    
    p {
        margin: 0.5rem 0;
        font-weight: bold;
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

const AddButton = styled.button`
    height: 70%;
    border: 3px solid #0A3B4E;
    border-radius: 15px;
    background-color: #629EBC;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
        background-color: #3D80A3;
    }
`;

/**
 * FoldersSection - Componente genérico para exibir pastas
 * @param {string} path - Caminho base para navegação ao clicar em uma pasta
 * @param {Array} folders - Array de pastas a serem exibidas 
 * @param {string} apiUrl - URL da API para buscar as pastas 
 * @param {string} folderNameField - Nome do campo que contém o nome da pasta (default: "predio")
 * @param {string} folderIdField - Nome do campo que contém o ID da pasta (default: "id")
 */
export default function FoldersSection({ 
    path, 
    folders: propFolders, 
    apiUrl,
    folderNameField = "predio",
    folderIdField = "id"
}) {
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

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
            const fetchFolders = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await axios.get(apiUrl);
                    if (response.data && Array.isArray(response.data)) {
                        setFolders(response.data);
                    } else {
                        console.error("Formato de resposta inesperado:", response.data);
                        setFolders([]);
                    }
                } catch (err) {
                    console.error("Erro ao buscar pastas:", err);
                    setError(err);
                    setFolders([]);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchFolders();
        }
    }, [propFolders, apiUrl, folderIdField, folderNameField]);
    
    return (
        <Container>
            {isLoading && <LoadingMessage>Carregando pastas...</LoadingMessage>}
            {error && <ErrorMessage>Erro ao carregar dados: {error.message}</ErrorMessage>}
            
            {!isLoading && !error && (!folders || folders.length === 0) && 
                <LoadingMessage>Nenhuma pasta encontrada.</LoadingMessage>}
              {!isLoading && !error && folders && folders.map((folder) => (
                <FolderCard 
                    key={folder[folderIdField]} 
                    onClick={() => navigate(`${path}/${encodeURIComponent(folder[folderNameField])}`)}
                >
                    <FaFolder />
                    <p>{folder[folderNameField]}</p>
                </FolderCard>
            ))}
            
            <AddButton>+ Adicionar Pasta</AddButton>
        </Container>
    );
}