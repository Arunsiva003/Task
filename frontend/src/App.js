import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import DashboardPage from './Components/Dashboard/DashboardPage';
import AddCodeForm from './Components/AddCode/Editor';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path='/' element={<DashboardPage/>} />
          <Route path='/addcode' element={<AddCodeForm/>} />
          <Route path='/addcode/:id' element={<AddCodeForm/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
