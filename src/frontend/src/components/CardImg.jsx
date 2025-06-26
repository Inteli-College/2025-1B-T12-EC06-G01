import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'

const Card = styled.div`
    position: relative;
    width: 100%;
    max-width: 300px;
    height: 245px;
    background-color: #D0D4DC;
    padding: var(--spacing-sm);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .topo-card-img {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      text-align: center;
      z-index: 3;
      position: relative;
    }

    @media (max-width: 768px) {
        height: 200px;
        padding: var(--spacing-xs);
        max-width: 250px;
    }

    @media (min-width: 1441px) {
        height: 280px;
        padding: var(--spacing-md);
        max-width: 350px;
    }
`

const CheckboxWrapper = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
    margin-bottom: var(--spacing-xs);
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 3;

    input[type="checkbox"] {
      display: none;
    }
    
    .custom-checkbox {
      width: 20px;
      height: 20px;
      border: 3px solid #3D4451;
      border-radius: 4px;
      background-color: #69758C;
      position: relative;
      transition: all 0.3s ease;
    }

    input[type="checkbox"]:checked + .custom-checkbox {
      background-color: #BDE0EE;
      border-color: var(--primary-color);
    }

    input[type="checkbox"]:checked + .custom-checkbox::after {
      content: "✔";
      position: absolute;
      left: 3px;
      top: -1px;
      font-size: 18px;
      color: white;
    }

    @media (max-width: 768px) {
        top: 8px;
        right: 8px;
        
        .custom-checkbox {
            width: 18px;
            height: 18px;
        }
        
        input[type="checkbox"]:checked + .custom-checkbox::after {
            font-size: 16px;
            left: 2px;
            top: -2px;
        }
    }

    @media (min-width: 1441px) {
        top: 12px;
        right: 12px;
        
        .custom-checkbox {
            width: 24px;
            height: 24px;
        }
        
        input[type="checkbox"]:checked + .custom-checkbox::after {
            font-size: 20px;
            left: 4px;
            top: 0px;
        }
    }
`

const ImagemCard = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1;
  overflow: hidden;
  border-radius: 15px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`

export default function CardImg({ url }) {
  const [checked, setChecked] = useState(false);

  return (
    <Card>
      <div className='topo-card-img'>
        <CheckboxWrapper>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <span className="custom-checkbox" />
        </CheckboxWrapper>
      </div>

      <ImagemCard>
        <img src={url} alt="Imagem da fachada" />
      </ImagemCard>

    </Card>
  );
}
