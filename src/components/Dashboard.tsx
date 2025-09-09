import React, { useState, useEffect, useCallback } from 'react';
import { Company, User } from '../types';
import { CompanyCard } from './CompanyCard';
import { AddCompanyModal } from './AddCompanyModal';
import { Plus, LogOut, Building2, Users as UsersIcon, AlertCircle, X } from 'lucide-react';
import { companyApi, userApi, authApi } from '../api';

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewAll, setViewAll] = useState(false);

  // 🔔 New state for closing notifications
  const [showNotifications, setShowNotifications] = useState(true);

  // Fetch companies
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
      } else {
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

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const fetchedUsers = await userApi.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users for assignment. Please try again.');
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleAddCompany = async (newCompanyData: Omit<Company, 'id' | 'createdAt'>) => {
    setError(null);
    try {
      await companyApi.addCompany(newCompanyData);
      setShowAddModal(false);
      fetchCompanies();

      if (newCompanyData.contactDate) {
        alert(`Reminder set: Contact ${newCompanyData.name} on ${newCompanyData.contactDate}`);
      }
    } catch (err: any) {
      console.error('Failed to add company:', err);
      if (err.response && err.response.status === 409) {
        setError('A company with this name already exists.');
      } else if (err.response && err.response.status === 404) {
        setError('Assigned user or escalated user not found.');
      } else {
        setError('Failed to add company. Please try again.');
      }
    }
  };

  const handleUpdateCompany = async (id: number, updates: Partial<Company>) => {
    setError(null);
    try {
      await companyApi.updateCompany(id, updates);
      fetchCompanies();
    } catch (err) {
      console.error('Failed to update company:', err);
      setError('Failed to update company. Please try again.');
    }
  };

  const handleAddComment = async (companyId: number, content: string) => {
    setCompanies(prev =>
      prev.map(c =>
        c.id === companyId
          ? {
              ...c,
              comments: [
                ...(c.comments || []),
                {
                  id: Date.now(),
                  companyId,
                  userId: currentUser.id,
                  content,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : c
      )
    );
  };

  const handleLogout = () => {
    authApi.logout();
    onLogout();
  };

  const stats = {
    total: companies.length,
    mine: companies.filter(c => c.assignedTo === currentUser.id).length,
    pending: companies.filter(c => c.status === 'PENDING').length,
    closed: companies.filter(c => c.status === 'CLOSED').length,
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const visibleCompanies = viewAll ? filteredCompanies : filteredCompanies.slice(0, 6);

  // 📌 Notifications logic
  const notifications = companies
    .filter(c => c.assignedTo === currentUser.id)
    .flatMap(c => {
      const notes: string[] = [];

      if (c.contactDate) {
        const contactDate = new Date(c.contactDate);
        const now = new Date();
        const diffDays = Math.ceil((contactDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          notes.push(`Meeting with ${c.name} is today.`);
        } else if (diffDays > 0 && diffDays <= 5) {
          notes.push(`Meeting with ${c.name} in ${diffDays} days.`);
        }
      }

      if (c.status === "PENDING") {
        if (c.contactDate) {
          notes.push(`Company ${c.name} is still pending (meeting on ${new Date(c.contactDate).toLocaleDateString()}).`);
        } else {
          notes.push(`Company ${c.name} is still pending (no meeting scheduled).`);
        }
      }

      return notes;
    });

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
                <span className="font-medium">{currentUser.firstname} {currentUser.surname}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🔔 Notifications */}
        {showNotifications && notifications.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 relative">
            {/* Close button */}
            <button
              onClick={() => setShowNotifications(false)}
              className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-bold text-yellow-800 mb-2">Reminders</h2>
            <ul className="space-y-1 text-yellow-700 text-sm">
              {notifications.map((note, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stats */}
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
            {(['all', 'mine', 'pending', 'closed'] as const).map(key => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === key
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Company</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
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

        {!loading && filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'Start by adding your first company.'
                : 'No companies match the selected filter.'}
            </p>
          </div>
        )}

        {!loading && visibleCompanies.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibleCompanies.map(company => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  users={users}
                  currentUser={currentUser}
                  onUpdate={handleUpdateCompany}
                  onAddComment={handleAddComment}
                />
              ))}
            </div>

            {filteredCompanies.length > 6 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setViewAll(!viewAll)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  {viewAll ? "Hide Companies" : "See All Companies"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showAddModal && (
        <AddCompanyModal
          users={users}
          currentUser={currentUser}
          assignedCompanies={companies}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCompany}
        />
      )}
    </div>
  );
};
