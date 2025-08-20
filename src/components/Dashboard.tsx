import React, { useState, useEffect, useCallback } from 'react';
import { Company, User } from '../types';
import { CompanyCard } from './CompanyCard';
import { AddCompanyModal } from './AddCompanyModal';
import { Plus, LogOut, Building2, Users as UsersIcon, AlertCircle, Search, X } from 'lucide-react';
import { companyApi, userApi, authApi } from '../api';

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
  onOpenComments: (company: Company) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  onLogout,
  onOpenComments,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'mine' | 'pending' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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

  // Function to filter companies based on search term
  const filterCompanies = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter(company => {
      const searchLower = searchTerm.toLowerCase();
      return (
        company.name.toLowerCase().includes(searchLower) ||
        company.contactDetails.contactPerson.toLowerCase().includes(searchLower) ||
        company.contactDetails.email.toLowerCase().includes(searchLower) ||
        company.contactDetails.phone.includes(searchTerm) ||
        (company.contactDetails.address && company.contactDetails.address.toLowerCase().includes(searchLower)) ||
        (company.notes && company.notes.toLowerCase().includes(searchLower))
      );
    });
    setFilteredCompanies(filtered);
  }, [companies, searchTerm]);

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
    fetchUsers();
  }, [fetchUsers]);

  // Fetch companies when filter changes or on initial mount
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Filter companies when search term or companies change
  useEffect(() => {
    filterCompanies();
  }, [filterCompanies]);

  const handleAddCompany = async (newCompanyData: Omit<Company, 'id' | 'createdAt'>) => {
    setError(null);
    try {
      await companyApi.addCompany(newCompanyData);
      setShowAddModal(false);
      fetchCompanies();
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

  const handleLogout = () => {
    authApi.logout();
    onLogout();
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const stats = {
    total: companies.length,
    mine: companies.filter(c => c.assignedTo === currentUser.id).length,
    pending: companies.filter(c => c.status === 'PENDING').length,
    closed: companies.filter(c => c.status === 'CLOSED').length,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-crm-primary" />
              <h1 className="text-xl font-bold">CRM System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Welcome, </span>
                <span className="font-medium">{currentUser.firstname} {currentUser.surname}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary-foreground transition-colors"
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
          <div className="bg-card p-6 rounded-lg shadow-md border">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Companies</div>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md border">
            <div className="text-2xl font-bold text-crm-primary">{stats.mine}</div>
            <div className="text-sm text-muted-foreground">My Companies</div>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md border">
            <div className="text-2xl font-bold text-status-pending">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending Deals</div>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md border">
            <div className="text-2xl font-bold text-status-closed">{stats.closed}</div>
            <div className="text-sm text-muted-foreground">Closed Deals</div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search companies, contacts, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-search-border rounded-lg focus:ring-2 focus:ring-search-focus focus:border-search-focus bg-search-background text-foreground placeholder-muted-foreground"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-crm-primary text-crm-primary-foreground'
                  : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border'
              }`}
            >
              All Companies
            </button>
            <button
              onClick={() => setFilter('mine')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'mine'
                  ? 'bg-crm-primary text-crm-primary-foreground'
                  : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border'
              }`}
            >
              My Companies
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-crm-primary text-crm-primary-foreground'
                  : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'closed'
                  ? 'bg-crm-primary text-crm-primary-foreground'
                  : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border'
              }`}
            >
              Closed
            </button>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-crm-primary text-crm-primary-foreground px-6 py-2 rounded-lg hover:bg-crm-primary-hover transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Company</span>
          </button>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-6 p-3 bg-accent/50 border border-accent rounded-lg">
            <p className="text-sm text-accent-foreground">
              Found {filteredCompanies.length} companies matching "{searchTerm}"
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="ml-2 text-crm-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-muted-foreground">Loading companies...</div>
        )}

        {!loading && filteredCompanies.length === 0 && !searchTerm && (
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No companies found</h3>
            <p className="text-muted-foreground">
              {filter === 'all' ? 'Start by adding your first company.' : 'No companies match the selected filter.'}
            </p>
          </div>
        )}

        {!loading && filteredCompanies.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or{' '}
              <button onClick={clearSearch} className="text-crm-primary hover:underline">
                clear the search
              </button>{' '}
              to see all companies.
            </p>
          </div>
        )}

        {!loading && filteredCompanies.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCompanies.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                users={users}
                currentUser={currentUser}
                onUpdate={handleUpdateCompany}
                onAddComment={(companyId, content) => {
                  // This can be expanded to actually add comments via API
                  console.log('Adding comment to company', companyId, ':', content);
                }}
              />
            ))}
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
          onSubmit={handleAddCompany}
        />
      )}
    </div>
  );
};