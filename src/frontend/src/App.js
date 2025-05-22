import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Projeto from './pages/Projeto';
import Predio from './pages/Predio';
import Fachada from './pages/Fachada'; 
import { ProjectProvider } from './contexts/ProjectContext';
import Projetos from './pages/Projetos';

function App() {
  return (
    <ProjectProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Projetos />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path='/projetos/:projectName' element={<Projeto />} />
          <Route path="/projetos/:projectName/:predioNome" element={<Predio />} />
          <Route path="/projetos/:projectName/:predioNome/:fachadaNome" element={<Fachada />} /> 
        </Routes>
      </Router>
    </ProjectProvider>
  );
}

export default App;
