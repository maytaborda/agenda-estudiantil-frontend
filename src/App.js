import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {AuthProvider} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Trabajos from './pages/Trabajos';
import Examenes from './pages/Examenes';
import Horario from './pages/Horario';
import Pomodoro from './pages/Pomodoro';

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route
            path="/examenes"
            element={
              <ProtectedRoute>
                <Examenes />
              </ProtectedRoute>
            } />
            <Route
            path="/trabajos"
            element={
              <ProtectedRoute>
                <Trabajos />
              </ProtectedRoute>
            } />
            <Route 
            path="/horario" 
            element={
              <ProtectedRoute>
                <Horario />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pomodoro" 
            element={
              <ProtectedRoute>
                <Pomodoro />
              </ProtectedRoute>
            } 
          />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;