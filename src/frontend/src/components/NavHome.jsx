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
        color: #fff;
        background-color: #8F8F8F;
        border: none;
        padding: .8rem .5rem;
        border-radius: 12px;
    }

    h3 {
        color: #fff;
        background-color: #6F6F6F;
        width: 80%;
        padding: .5rem;
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
        border: none;
        border-radius: 15px;
        background-color: #8F8F8F;
        color: #fff;
    }

    button:hover {
        background-color: #6f6f6f;
        cursor: pointer;
    }

    svg {
        font-size: 1.5rem;
    }
`

export default function NavHome() {

    const [projectName, setProjectName] = useState('Nome do projeto')
    const [dateFilter, setDateFilter] = useState(null)
    const [optionFilter, setOptionFilter] = useState('')
    const [latitudeFilter, setLatitudeFilter] = useState('')
    const [longitudeFilter, setLongitudeFilter] = useState('')

    return (
        <Nav>
            <Infos>
                <h3>{projectName}</h3>
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
                <button> <IoSend /> </button>
            </Botoes>
        </Nav>
    )
}
