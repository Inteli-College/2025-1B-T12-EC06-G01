import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'

const Card = styled.div`
    position: relative;
    width: 80%;
    height: 245px;
    background-color: #D0D4DC;
    padding: 1rem;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .topo-card-img {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      text-align: center;
      z-index: 3;
      position: relative;
    }

    input[type=checkbox] {
      border: none;
      padding: 62px;
    }

`

const CheckboxWrapper = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
    margin-bottom: .5rem;
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
      background-color: white;
      position: relative;
      background-color: #69758C;
      position: relative;
    }

    input[type="checkbox"]:checked + .custom-checkbox {
      background-color: #BDE0EE;
    }

    input[type="checkbox"]:checked + .custom-checkbox::after {
      content: "✔";
      position: absolute;
      left: 3px;
      top: -1px;
      font-size: 18px;
      color: white;
    }
`

const ImagemCard = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
        <img src={url} alt="sim" />
      </ImagemCard>

    </Card>
  );
}
