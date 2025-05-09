import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <h1>Rooster</h1>
      <Sidebar />
      <img src={logo} alt=""/>
    </div>
  );
}

export default App;
