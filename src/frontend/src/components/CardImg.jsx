import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
    width: 280px;
    height: 320px;
    border: 2px solid ${props => props.selected ? '#0A3B4E' : '#e0e0e0'};
    border-radius: 15px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${props => props.selected ? '#f0f8ff' : 'white'};
    box-shadow: ${props => props.selected ? '0 4px 20px rgba(10, 59, 78, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.1)'};

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
        border-color: #629EBC;
    }

    img {
        width: 100%;
        height: 70%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    &:hover img {
        transform: scale(1.05);
    }
`;

const CardContent = styled.div`
    padding: 1rem;
    height: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: ${props => props.selected ? '#f0f8ff' : 'white'};

    h4 {
        margin: 0 0 0.5rem 0;
        color: #0A3B4E;
        font-size: 1.1rem;
        font-weight: 600;
    }

    p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
    }

    .selected-indicator {
        color: #0A3B4E;
        font-weight: bold;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
`;

const CardImg = ({ 
    img_name, 
    url, 
    project = "projeto", 
    id, 
    fresh_img,
    selected = false,
    onClick 
}) => {
    const imageUrl = fresh_img || url;

    const handleClick = () => {
        if (onClick) {
            onClick({
                id,
                img_name,
                raw_img: url,
                fresh_img: fresh_img,
                project,
                url: imageUrl
            });
        }
    };

    return (
        <Card selected={selected} onClick={handleClick}>
            <img 
                src={imageUrl} 
                alt={img_name}
                onError={(e) => {
                    console.error(`Erro ao carregar imagem: ${imageUrl}`);
                    e.target.src = '/placeholder-image.png'; // Imagem placeholder se houver erro
                }}
            />
            <CardContent selected={selected}>
                <h4>{img_name}</h4>
                <p>{project}</p>
                {selected && (
                    <div className="selected-indicator">
                        ✓ Selecionada
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CardImg;
