import React, { useState } from 'react';
import { User, Company } from '../types';
import { Dashboard } from '../components/Dashboard';
import { LoginForm } from '../components/LoginForm';
import { CommentsModal } from '../components/CommentsModal';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedCompany(null);
    setShowCommentsModal(false);
  };

  const handleOpenComments = (company: Company) => {
    setSelectedCompany(company);
    setShowCommentsModal(true);
  };

  const handleCloseComments = () => {
    setShowCommentsModal(false);
    setSelectedCompany(null);
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <>
      <Dashboard
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenComments={handleOpenComments}
      />
      
      {showCommentsModal && selectedCompany && (
        <CommentsModal
          company={selectedCompany}
          users={[]} // This would come from the Dashboard in a real app
          currentUser={currentUser}
          onClose={handleCloseComments}
          onAddComment={(companyId, content) => {
            console.log('Adding comment to company', companyId, ':', content);
          }}
        />
      )}
    </>
  );
};

export default Index;
