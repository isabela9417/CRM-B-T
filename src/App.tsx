import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User } from './types';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { authApi } from './api'; 
import { jwtDecode } from 'jwt-decode';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

 useEffect(() => {
  const token = localStorage.getItem('authToken');
  console.log("Token:", token);

  if (!token) {
    console.log("No token found. Logging out.");
    handleLogout();
    return;
  }

  try {
    const decoded: any = jwtDecode(token);

    const user: User = {
      id: decoded.id,
      firstname: decoded.firstname,
      surname: decoded.surname,
      email: decoded.email,
      role: decoded.role,
      contactNumber: '',
      name: ''
    };

    setCurrentUser(user); // <-- THIS is what was missing

  } catch (e) {
    console.log("Invalid token. Logging out.");
    handleLogout();
  }
}, []);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
    navigate('/dashboard'); 
  };

  const handleLogout = () => {
    authApi.logout(); 
    setCurrentUser(null); 
    navigate('/login'); 
  };

  return (
    <Routes>
      <Route path="/login" element={
        currentUser ? <Navigate to="/dashboard" replace /> : <LoginForm onLogin={handleLogin} />
      } />

      <Route path="/dashboard" element={
        currentUser ? (
          <Dashboard
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        ) : (
          <Navigate to="/login" replace /> 
        )
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
