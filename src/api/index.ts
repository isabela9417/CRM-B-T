import { Company, User } from '../types';

// Mock API functions - replace with actual API calls in production
export const companyApi = {
  async getAllCompanies(filters?: { 
    assignedTo?: number; 
    status?: string;
  }): Promise<Company[]> {
    // Mock data - replace with actual API call
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Tech Solutions Inc',
        contactDetails: {
          email: 'contact@techsolutions.com',
          phone: '+1-555-0123',
          address: '123 Tech Street, Silicon Valley, CA 94000',
          contactPerson: 'John Smith'
        },
        assignedTo: 1,
        assignedBy: 1,
        contactDate: '2024-01-15',
        meetingDate: '2024-01-20',
        status: 'PENDING',
        escalatedTo: null,
        notes: 'Interested in our enterprise solutions',
        createdAt: '2024-01-15T10:30:00Z',
        comments: []
      },
      {
        id: 2,
        name: 'Global Marketing Co',
        contactDetails: {
          email: 'info@globalmarketing.com',
          phone: '+1-555-0456',
          address: '456 Business Ave, New York, NY 10001',
          contactPerson: 'Sarah Johnson'
        },
        assignedTo: 2,
        assignedBy: 1,
        contactDate: '2024-01-16',
        meetingDate: '2024-01-22',
        status: 'CLOSED',
        escalatedTo: null,
        notes: 'Successfully closed deal for $50k',
        createdAt: '2024-01-16T14:20:00Z',
        comments: []
      }
    ];

    // Apply filters
    let filtered = mockCompanies;
    if (filters?.assignedTo) {
      filtered = filtered.filter(c => c.assignedTo === filters.assignedTo);
    }
    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    return Promise.resolve(filtered);
  },

  async addCompany(company: Omit<Company, 'id' | 'createdAt'>): Promise<Company> {
    // Mock implementation - replace with actual API call
    const newCompany: Company = {
      ...company,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      comments: []
    };
    return Promise.resolve(newCompany);
  },

  async updateCompany(id: number, updates: Partial<Company>): Promise<Company> {
    // Mock implementation - replace with actual API call
    const updatedCompany: Company = {
      id,
      name: 'Updated Company',
      contactDetails: {
        email: 'updated@company.com',
        phone: '+1-555-0000',
        address: 'Updated Address',
        contactPerson: 'Updated Person'
      },
      assignedTo: 1,
      assignedBy: 1,
      contactDate: '2024-01-01',
      meetingDate: '2024-01-01',
      status: 'PENDING',
      escalatedTo: null,
      createdAt: '2024-01-01T00:00:00Z',
      comments: [],
      ...updates
    };
    return Promise.resolve(updatedCompany);
  }
};

export const userApi = {
  async getAllUsers(): Promise<User[]> {
    // Mock data - replace with actual API call
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        firstname: 'John',
        surname: 'Doe',
        email: 'john.doe@company.com',
        role: 'ADMIN',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        name: 'Jane Smith',
        firstname: 'Jane',
        surname: 'Smith',
        email: 'jane.smith@company.com',
        role: 'USER',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];
    return Promise.resolve(mockUsers);
  }
};

export const authApi = {
  logout(): void {
    // Mock implementation - replace with actual logout logic
    console.log('User logged out');
  }
};