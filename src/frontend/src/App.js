import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projects from './pages/Projects';
import ProjectPredios from './pages/ProjectPredios';
import Predio from './pages/Predio';
import Fachada from './pages/Fachada'; 
import { ProjectProvider } from './contexts/ProjectContext';
import Result from './pages/Result';
import { SelectedImagesProvider } from './contexts/SelectedImagesContext';

import LoginRegister from './pages/LoginCadastro';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import Actions from './pages/Actions';

function App() {
  return (

    <Router>
      <AuthProvider>
        <ProjectProvider>
         <SelectedImagesProvider>
          <Routes>
            <Route path="/" element={<LoginRegister />} /> 

            <Route element={<PrivateRoute />}>
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:projectId/predios" element={<ProjectPredios />} />
              <Route path="/project/:projectId/predio/:predioNome" element={<Predio />} />
              <Route path="/project/:projectId/predio/:predioNome/:fachadaNome" element={<Fachada />} />
              <Route path="/predio/:predioNome" element={<Predio />} />
              <Route path="/predio/:predioNome/:fachadaNome" element={<Fachada />} />
              <Route path="/result/:facadeId" element={<Result />} />
              <Route path="/detect/:facadeId" element={<DetectResult />} />
              <Route path='/actions' element={<Actions />} />
            </Route>
          </Routes>
         </SelectedImagesProvider>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
