import { Route, Routes } from 'react-router-dom';
import './App.css';
import Registration from './Components/User/Registration';
import Landing from './Components/Landing';
import Login from './Components/User/Login';
import Home from './Components/User/Home';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path='/home/:id' element={<PrivateRoute><Home /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
