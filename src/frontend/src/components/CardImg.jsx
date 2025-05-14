import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'

const Card = styled.div`
    width: 90%;
    height: 245px;
    background-color: #8F8F8F;
    padding: 1rem;
    border-radius: 20px;

    .topo-card-img {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
    }

    p {
      margin: 0;
      margin-bottom: .5rem;
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
    z-index: 1;

    input[type="checkbox"] {
      display: none;
    }
    .custom-checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid #555;
      border-radius: 4px;
      background-color: white;
      position: relative;
      background-color:rgb(112, 112, 112);
    }

    input[type="checkbox"]:checked + .custom-checkbox::after {
      content: "✔";
      position: absolute;
      left: 3px;
      top: -1px;
      font-size: 18px;
      color: white;
      background-color: #545454;
    }
`

const ImagemCard = styled.div`
  width: 100%;
  height: 70%;
  backgroung-color: #fff;
`

export default function CardImg() {
  const [checked, setChecked] = useState(false);

  return (
    <Card>
      <div className='topo-card-img'>
        <p width="80%">Título da imagem</p>
        <CheckboxWrapper>
          <input
            type="checkbox"
            id="myCheckbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <span className="custom-checkbox" />
        </CheckboxWrapper>
      </div>

      <div style={{ width: '100%', height: '87%', backgroundColor: '#fff' }} />
    </Card>
  )
}
