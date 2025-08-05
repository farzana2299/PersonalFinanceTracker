import { Route, Routes } from 'react-router-dom';
import './App.css';
import Registration from './Components/User/Registration';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;
