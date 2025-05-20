import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Predio from './pages/Predio';
import Fachada from './pages/Fachada'; 
import { ProjectProvider } from './contexts/ProjectContext';

function App() {
  return (
    <ProjectProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predio/:predioNome" element={<Predio />} />
          <Route path="/predio/:predioNome/:fachadaNome" element={<Fachada />} /> {/* opcional */}
        </Routes>
      </Router>
    </ProjectProvider>
  );
}

export default App;
