import React, { useState, useEffect, useCallback } from 'react';
import { Company, User } from '../types';
import { CompanyCard } from './CompanyCard';
import { AddCompanyModal } from './AddCompanyModal';
import { Plus, LogOut, Building2, Users as UsersIcon, AlertCircle } from 'lucide-react'; // Renamed Users to UsersIcon to avoid conflict with 'users' state
import { companyApi, userApi, authApi } from '../api'; // Import your API services

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  onLogout,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'mine' | 'pending' | 'closed'>('all');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]); // State to hold all users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch companies from the backend
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let fetchedCompanies: Company[] = [];
      if (filter === 'mine') {
        fetchedCompanies = await companyApi.getAllCompanies({ assignedTo: currentUser.id });
      } else if (filter === 'pending') {
        fetchedCompanies = await companyApi.getAllCompanies({ status: 'PENDING' });
      } else if (filter === 'closed') {
        fetchedCompanies = await companyApi.getAllCompanies({ status: 'CLOSED' });
      } else { // 'all'
        fetchedCompanies = await companyApi.getAllCompanies();
      }
      setCompanies(fetchedCompanies);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filter, currentUser.id]);

  // Function to fetch all users from the backend
  const fetchUsers = useCallback(async () => {
    try {
      const fetchedUsers = await userApi.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users for assignment. Please try again.');
    }
  }, []);

  // Initial data fetch on component mount
  useEffect(() => {
    fetchUsers(); // Fetch users once on mount
  }, [fetchUsers]);

  // Fetch companies when filter changes or on initial mount
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);


  const handleAddCompany = async (newCompanyData: Omit<Company, 'id' | 'createdAt'>) => {
    setError(null);
    try {
      await companyApi.addCompany(newCompanyData);
      setShowAddModal(false); // Close modal on success
      fetchCompanies(); // Re-fetch companies to update the list
    } catch (err: any) {
      console.error('Failed to add company:', err);
      if (err.response && err.response.status === 409) {
        setError('A company with this name already exists.');
      } else if (err.response && err.response.status === 404) {
        setError('Assigned user or escalated user not found.');
      }
      else {
        setError('Failed to add company. Please try again.');
      }
    }
  };

  const handleUpdateCompany = async (id: number, updates: Partial<Company>) => {
    setError(null);
    try {
      await companyApi.updateCompany(id, updates);
      fetchCompanies(); // Re-fetch companies to update the list
    } catch (err) {
      console.error('Failed to update company:', err);
      setError('Failed to update company. Please try again.');
    }
  };

  const handleLogout = () => {
    authApi.logout(); // Clear token
    onLogout(); // Navigate to login page
  };

  const stats = {
    total: companies.length,
    mine: companies.filter(c => c.assignedTo === currentUser.id).length,
    pending: companies.filter(c => c.status === 'PENDING').length,
    closed: companies.filter(c => c.status === 'CLOSED').length,
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
                <span className="font-medium">{currentUser.firstname} {currentUser.surname}</span> {/* Use firstname/surname */}
              </div>
              <button
                onClick={handleLogout}
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-gray-600">Loading companies...</div>
        )}

        {!loading && companies.length === 0 && ( // Changed filteredCompanies to companies for initial check
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'Start by adding your first company.' : 'No companies match the selected filter.'}
            </p>
          </div>
        )}

        {!loading && companies.length > 0 && ( // Changed filteredCompanies to companies
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {companies.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                users={users} // Pass fetched users
                currentUser={currentUser}
                onUpdate={handleUpdateCompany}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <AddCompanyModal
          users={users} // Pass fetched users
          currentUser={currentUser}
          assignedCompanies={companies} // Still pass for client-side check before API call
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCompany}
        />
      )}
    </div>
  );
};