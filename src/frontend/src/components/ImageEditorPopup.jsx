import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const PopupOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const PopupContent = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: 15px;
    width: 80%;
    max-width: 800px;
    max-height: 90%;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const PopupHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 1rem;

    h2 {
        color: #0A3B4E;
        margin: 0;
    }

    button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const ImageContainer = styled.div`
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    align-items: flex-start;
`;

const ImagePreview = styled.div`
    flex: 1;
    text-align: center;

    h3 {
        color: #0A3B4E;
        margin-bottom: 1rem;
    }

    img {
        max-width: 100%;
        max-height: 300px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        object-fit: contain;
    }
`;

const ControlsContainer = styled.div`
    flex: 1;
    padding-left: 2rem;
    border-left: 2px solid #f0f0f0;
`;

const OperationGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
`;

const OperationButton = styled.button`
    padding: 1rem;
    border: 2px solid #0A3B4E;
    border-radius: 10px;
    background-color: #629EBC;
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:hover {
        background-color: #3D80A3;
        transform: translateY(-2px);
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        transform: none;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid #f0f0f0;

    button {
        padding: 0.8rem 1.5rem;
        border: 2px solid #0A3B4E;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .cancel-btn {
        background-color: white;
        color: #0A3B4E;

        &:hover {
            background-color: #f0f0f0;
        }
    }

    .save-btn {
        background-color: #629EBC;
        color: white;

        &:hover {
            background-color: #3D80A3;
        }

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    }
`;

const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    
    &::after {
        content: '';
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #629EBC;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const ImageEditorPopup = ({ selectedImage, onClose, onSave }) => {
    const [originalImage, setOriginalImage] = useState(null);
    const [editedImage, setEditedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const operations = {
        'cinza': 'Escala de Cinza',
        'blur': 'Desfoque',
        'inversao': 'Inverter Cores',
        'contraste': 'Aumentar Contraste',
        'sharpen': 'Aumentar Nitidez',
        'bordas': 'Detectar Bordas'
    };

    useEffect(() => {
        if (selectedImage) {
            setOriginalImage(selectedImage.raw_img || selectedImage.url);
            setEditedImage(selectedImage.fresh_img || selectedImage.raw_img || selectedImage.url);
        }
    }, [selectedImage]);

    const handleOperation = async (operation) => {
        if (!selectedImage?.id) {
            alert('Erro: ID da imagem não encontrado');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:5000/pincel/edit/${selectedImage.id}/${operation}`
            );

            if (response.data.success) {
                setEditedImage(response.data.image_url);
                setHasChanges(true);
            } else {
                alert('Erro ao processar imagem: ' + response.data.error);
            }
        } catch (error) {
            console.error('Erro ao aplicar operação:', error);
            alert('Erro ao processar imagem. Verifique se o servidor está rodando.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (hasChanges && editedImage) {
            onSave({
                ...selectedImage,
                fresh_img: editedImage
            });
        }
        onClose();
    };

    const handleReset = () => {
        setEditedImage(originalImage);
        setHasChanges(false);
    };

    if (!selectedImage) return null;

    return (
        <PopupOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
            <PopupContent>
                <PopupHeader>
                    <h2>Editor de Imagens</h2>
                    <button onClick={onClose}>✕</button>
                </PopupHeader>

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <ImageContainer>
                            <ImagePreview>
                                <h3>Imagem Original</h3>
                                {originalImage && (
                                    <img 
                                        src={originalImage} 
                                        alt="Original" 
                                        onError={(e) => {
                                            console.error('Erro ao carregar imagem original');
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                            </ImagePreview>

                            <ImagePreview>
                                <h3>Imagem Editada</h3>
                                {editedImage && (
                                    <img 
                                        src={editedImage} 
                                        alt="Editada" 
                                        onError={(e) => {
                                            console.error('Erro ao carregar imagem editada');
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                            </ImagePreview>
                        </ImageContainer>

                        <ControlsContainer>
                            <h3 style={{ color: '#0A3B4E', marginBottom: '1rem' }}>Ferramentas de Edição</h3>
                            <OperationGrid>
                                {Object.entries(operations).map(([key, label]) => (
                                    <OperationButton
                                        key={key}
                                        onClick={() => handleOperation(key)}
                                        disabled={isLoading}
                                    >
                                        {label}
                                    </OperationButton>
                                ))}
                                <OperationButton
                                    onClick={handleReset}
                                    disabled={isLoading || !hasChanges}
                                    style={{ 
                                        backgroundColor: hasChanges ? '#ff6b6b' : '#ccc',
                                        borderColor: hasChanges ? '#ff5252' : '#999'
                                    }}
                                >
                                    Resetar
                                </OperationButton>
                            </OperationGrid>
                        </ControlsContainer>

                        <ActionButtons>
                            <button className="cancel-btn" onClick={onClose}>
                                Cancelar
                            </button>
                            <button 
                                className="save-btn" 
                                onClick={handleSave}
                                disabled={!hasChanges}
                            >
                                Salvar Alterações
                            </button>
                        </ActionButtons>
                    </>
                )}
            </PopupContent>
        </PopupOverlay>
    );
};

export default ImageEditorPopup;