import React from 'react'
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import RetrainProgress from '../components/RetrainProgress';
import SelectVersion from '../components/SelectVersion';

const ActionsPage = styled.div`
  display: flex;
  flex-direction: row;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 18vw;

  h1 {
    margin-left: 22vw;
    padding: 2.5rem;
  }
`

export default function Actions() {

  return (
    <ActionsPage>
        <Sidebar />
        <Body>
            <RetrainProgress />

            <hr />

            <SelectVersion />
        </Body>
    </ActionsPage>
  )
}
