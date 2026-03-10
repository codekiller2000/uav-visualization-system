import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ScenarioList from './pages/ScenarioList'
import ScenarioDetail from './pages/ScenarioDetail'
import ExperimentList from './pages/ExperimentList'
import ExperimentDetail from './pages/ExperimentDetail'
import AdminPanel from './pages/AdminPanel'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  )

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/scenarios"
          element={isAuthenticated ? <ScenarioList onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/scenario/:id"
          element={isAuthenticated ? <ScenarioDetail onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/experiments"
          element={isAuthenticated ? <ExperimentList onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/experiment/:id"
          element={isAuthenticated ? <ExperimentDetail onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminPanel onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App
