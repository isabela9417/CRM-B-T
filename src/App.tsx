import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { User, Company } from './types';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { CompanyDetailsModal } from './components/CompanyDetailsModal';
import { CommentsModal } from './components/CommentsModal';
import { authApi, companyApi, userApi } from './api';
import { jwtDecode } from 'jwt-decode';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // This useEffect handles user authentication and initial data fetching
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log("No token found. Logging out.");
      handleLogout();
      setIsLoading(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);

      // Check token expiration
      const currentTime = Date.now() / 1000; // in seconds
      if (decoded.exp && decoded.exp < currentTime) {
        console.log("Token expired. Logging out.");
        handleLogout();
        setIsLoading(false);
        return;
      }

      // Set auto logout when token expires
      if (decoded.exp) {
        const timeout = decoded.exp * 1000 - Date.now();
        setTimeout(() => {
          console.log("Token expired. Auto logging out.");
          handleLogout();
        }, timeout);
      }
      
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
      setIsLoading(false);
      return;
    }

    // Fetch all companies and users from the API
    const fetchData = async () => {
      try {
        const [companies, users] = await Promise.all([
          companyApi.getAllCompanies(),
          userApi.getAllUsers(),
        ]);
        setAllCompanies(companies);
        setAllUsers(users);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  // Define a wrapper component for the modal routes to access URL params and data
  const CompanyModalWrapper = () => {
    const { id } = useParams();
    const companyId = parseInt(id || '0');
    const company = allCompanies.find(c => c.id === companyId);

    if (!company) {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <CompanyDetailsModal
        company={company}
        onClose={() => navigate(-1)}
        onUpdate={(updatedId, updates) => console.log("Updating company", updatedId, updates)}
        canEdit={currentUser?.role === "ADMIN"}
      />
    );
  };

  const CommentsModalWrapper = () => {
    const { id } = useParams();
    const companyId = parseInt(id || '0');
    const company = allCompanies.find(c => c.id === companyId);

    if (!company) {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <CommentsModal
        company={company}
        users={allUsers}
        currentUser={currentUser!}
        onClose={() => navigate(-1)}
      />
    );
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
            <Dashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              companies={allCompanies}
              users={allUsers}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* COMPANY DETAILS PAGE */}
      <Route
        path="/company/:id"
        element={currentUser ? <CompanyModalWrapper /> : <Navigate to="/login" replace />}
      />

      {/* COMMENTS PAGE */}
      <Route
        path="/company/:id/comments"
        element={currentUser ? <CommentsModalWrapper /> : <Navigate to="/login" replace />}
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
