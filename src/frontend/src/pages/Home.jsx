import React from "react";
import Sidebar from "../components/Sidebar";
import NavHome from "../components/NavHome";
import styled from "styled-components";
import FoldersSection from "../components/FoldersSection";

const Homepage = styled.div`
  display: flex;
  flex-direction: row;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Home() {
  return (
    <Homepage>
      <Sidebar />
      <Body>
        <NavHome />
        <FoldersSection
          path="/predio"
          apiUrl="http://localhost:5000/building/"
          folderNameField="predio"
          folderIdField="id"
        />{" "}
      </Body>
    </Homepage>
  );
}
