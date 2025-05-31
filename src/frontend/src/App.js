import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projects from './pages/Projects';
import ProjectPredios from './pages/ProjectPredios';
import Predio from './pages/Predio';
import Fachada from './pages/Fachada'; 
import { ProjectProvider } from './contexts/ProjectContext';
import Result from './pages/Result';

function App() {
  return (
    <ProjectProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:projectId/predios" element={<ProjectPredios />} />
          <Route path="/project/:projectId/predio/:predioNome" element={<Predio />} />
          <Route path="/project/:projectId/predio/:predioNome/:fachadaNome" element={<Fachada />} />
          {/* Rotas antigas mantidas para compatibilidade */}
          <Route path="/predio/:predioNome" element={<Predio />} />
          <Route path="/predio/:predioNome/:fachadaNome" element={<Fachada />} />
          <Route path="/resultado" element={<Result />} />
        </Routes>
      </Router>
    </ProjectProvider>
  );
}

export default App;
