import React, { useState } from 'react';
import { Company, User } from '../types';
import { CompanyCard } from './CompanyCard';
import { AddCompanyModal } from './AddCompanyModal';
import { Plus, LogOut, Building2, Users } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  companies: Company[];
  users: User[];
  onAddCompany: (company: Omit<Company, 'id' | 'createdAt'>) => void;
  onUpdateCompany: (id: string, updates: Partial<Company>) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  companies,
  users,
  onAddCompany,
  onUpdateCompany,
  onLogout,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'mine' | 'pending' | 'closed'>('all');

  const filteredCompanies = companies.filter(company => {
    switch (filter) {
      case 'mine':
        return company.assignedTo === currentUser.id;
      case 'pending':
        return company.status === 'pending';
      case 'closed':
        return company.status === 'closed';
      default:
        return true;
    }
  });

  const stats = {
    total: companies.length,
    mine: companies.filter(c => c.assignedTo === currentUser.id).length,
    pending: companies.filter(c => c.status === 'pending').length,
    closed: companies.filter(c => c.status === 'closed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-red-600" />
              <h1 className="text-xl font-bold">CRM System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-300">Welcome, </span>
                <span className="font-medium">{currentUser.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-black">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Companies</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-red-600">{stats.mine}</div>
            <div className="text-sm text-gray-600">My Companies</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending Deals</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600">{stats.closed}</div>
            <div className="text-sm text-gray-600">Closed Deals</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Companies
            </button>
            <button
              onClick={() => setFilter('mine')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'mine'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Companies
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'closed'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Closed
            </button>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Company</span>
          </button>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
            <CompanyCard
              key={company.id}
              company={company}
              users={users}
              currentUser={currentUser}
              onUpdate={onUpdateCompany}
            />
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'Start by adding your first company.' : 'No companies match the selected filter.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <AddCompanyModal
          users={users}
          currentUser={currentUser}
          assignedCompanies={companies}
          onClose={() => setShowAddModal(false)}
          onSubmit={onAddCompany}
        />
      )}
    </div>
  );
};