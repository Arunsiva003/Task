import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import './App.css';
// import AddCodeForm from './Components/AddCode/AddCode';
import DashboardPage from './Components/Dashboard/DashboardPage';
import AddCodeForm from './Components/AddCode/Editor';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path='/' element={<DashboardPage/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path='/addcode' element={<AddCodeForm/>} />
          <Route path='/addcode/:id' element={<AddCodeForm/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
