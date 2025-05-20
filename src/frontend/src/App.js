import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Folder from './pages/Folder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projeto/:folderName" element={<Folder />} />
      </Routes>
    </Router>
  );
}

export default App;
