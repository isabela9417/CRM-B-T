import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, Company } from './types';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { CompanyDetailsModal } from './components/CompanyDetailsModal';
import { CommentsModal } from './components/CommentsModal';
import { authApi } from './api';
import { jwtDecode } from 'jwt-decode';

// Mock sample data (replace with your API / DB later)
const mockCompany: Company = {
  id: 1,
  name: "Tech Solutions Inc.",
  contactDetails: {
    contactPerson: "Alice Johnson",
    phone: "123-456-7890",
    email: "alice@techsolutions.com",
    address: "123 Main Street, Cape Town",
  },
  comments: [],
};

const mockUsers: User[] = [
  { id: 1, firstname: "Alice", surname: "Johnson", email: "alice@example.com", role: "admin", contactNumber: "", name: "Alice J." },
  { id: 2, firstname: "Bob", surname: "Smith", email: "bob@example.com", role: "user", contactNumber: "", name: "Bob S." },
];

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

      setCurrentUser(user);
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
      {/* LOGIN */}
      <Route
        path="/login"
        element={
          currentUser ? <Navigate to="/dashboard" replace /> : <LoginForm onLogin={handleLogin} />
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          currentUser ? (
            <Dashboard currentUser={currentUser} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* COMPANY DETAILS PAGE */}
      <Route
        path="/company/:id"
        element={
          currentUser ? (
            <CompanyDetailsModal
              company={mockCompany}
              onClose={() => navigate(-1)}
              onUpdate={(id, updates) => console.log("Updating company", id, updates)}
              canEdit={currentUser.role === "admin"}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* COMMENTS PAGE */}
      <Route
        path="/company/:id/comments"
        element={
          currentUser ? (
            <CommentsModal
              company={mockCompany}
              users={mockUsers}
              currentUser={currentUser}
              onClose={() => navigate(-1)}
              onAddComment={(companyId, content) => console.log("New comment", companyId, content)}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* DEFAULT */}
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
