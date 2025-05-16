import React, { useState } from 'react'
import styled from 'styled-components'
import { FaTrash, FaPaintBrush } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'


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
        gap: .8rem
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
`

export default function NavHome({ projectName }) {

    const [dateFilter, setDateFilter] = useState(null)
    const [optionFilter, setOptionFilter] = useState('')
    const [latitudeFilter, setLatitudeFilter] = useState('')
    const [longitudeFilter, setLongitudeFilter] = useState('')

    return (
        <Nav>
            <Infos>
                {projectName === '' ? <h3>Adicione um projeto</h3> : <h3>{projectName}</h3>}

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
                <button className='send-button'> <span>Enviar</span> <IoSend /> </button>
            </Botoes>
        </Nav>
    )
}
