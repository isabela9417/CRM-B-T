import React, { useState } from 'react';
import { User, Company } from './types';
import { USERS } from './data/users';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddCompany = (companyData: Omit<Company, 'id' | 'createdAt'>) => {
    const newCompany: Company = {
      ...companyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCompanies(prev => [...prev, newCompany]);
  };

  const handleUpdateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === id ? { ...company, ...updates } : company
      )
    );
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      currentUser={currentUser}
      companies={companies}
      users={USERS}
      onAddCompany={handleAddCompany}
      onUpdateCompany={handleUpdateCompany}
      onLogout={handleLogout}
    />
  );
}

export default App;