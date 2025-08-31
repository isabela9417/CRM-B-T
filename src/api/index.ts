// src/api/index.ts
import axios from 'axios';
import { User, Company } from '../types'; // Adjust path as needed

// Your Spring Boot backend base URL
// Make sure this matches where your Spring Boot app is running
const API_BASE_URL = 'http://localhost:8081/api';

// --- Authentication API ---
interface LoginRequestPayload {
  email: string;
  password: string;
}

// Response from /api/auth/login
interface AuthLoginResponse {
  message: string;
  user: {
    id: number; //
    firstname: string; //
    email: string; //
    role: User['role']; //
    token: string; //
  };
}

export const authApi = {
  login: async (credentials: LoginRequestPayload): Promise<User> => {
    // Calls the /api/auth/login endpoint
    const response = await axios.post<AuthLoginResponse>(`${API_BASE_URL}/auth/login`, credentials);

    // Extract user data from the nested 'user' object in the response
    const { id, firstname, email, role } = response.data.user;

    // You might want to store the token for future authenticated requests
    localStorage.setItem('authToken', response.data.user.token);

    // Note: The backend's AuthController.java only returns firstname and email in the user map.
    // If you need surname and contactNumber immediately after login,
    // you'd need to modify the AuthController's login response or fetch the full user profile separately.
    // For now, we'll construct a partial User object and assume surname is empty or fetched later.
    // Ideally, the backend would return a more complete User DTO or the full User object (without password).
    return {
      id,
      firstname,
      surname: '', // Placeholder, as not directly returned by AuthController.java login endpoint
      email,
      role,
      contactNumber: '', // Placeholder
      name: `${firstname}`, // Default name for now
    };
  },
  
  logout: () => {
    localStorage.removeItem('authToken'); // Clear token on logout
    // You might also call a backend /logout endpoint if you have session management
  }
};

// Axios Interceptor to add Authorization header for subsequent requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


// --- Users API (assuming you have a UserController for these) ---
// This part is an assumption, you would need to implement UserController endpoints
// for /api/users and /api/users/{id}
export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
    return response.data.map(user => ({
      ...user,
      name: `${user.firstname} ${user.surname}` // Combine for frontend display
    }));
  },
  getUserById: async (id: number): Promise<User> => {
    const response = await axios.get<User>(`${API_BASE_URL}/users/${id}`);
    return { ...response.data, name: `${response.data.firstname} ${response.data.surname}` };
  },
};

// --- Companies API (assuming you have a CompanyController for these) ---
// This part is an assumption, you would need to implement CompanyController endpoints
// for /api/companies, /api/companies/{id}, etc.
interface CompanyForm extends Omit<Company, 'id' | 'createdAt'> {}

export const companyApi = {
  getAllCompanies: async (filter?: { assignedTo?: number; status?: Company['status'] }): Promise<Company[]> => {
    let url = `${API_BASE_URL}/companies`;
    const params = new URLSearchParams();
    if (filter?.assignedTo) {
      params.append('assignedTo', filter.assignedTo.toString());
    }
    if (filter?.status) {
      params.append('status', filter.status.toUpperCase());
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const response = await axios.get<Company[]>(url);
    return response.data;
  },

  addCompany: async (companyData: CompanyForm): Promise<Company> => {
    const response = await axios.post<Company>(`${API_BASE_URL}/companies`, companyData);
    return response.data;
  },

  updateCompany: async (id: number, updates: Partial<Company>): Promise<Company> => {
    const response = await axios.patch<Company>(`${API_BASE_URL}/companies/${id}`, updates);
    return response.data;
  },


  deleteCompany: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/companies/${id}`);
  }
};


export const commentsApi = {
  getCommentsByCompany: async (companyId: number): Promise<Comment[]> => {
    const response = await axios.get<Comment[]>(`${API_BASE_URL}/comments/company/${companyId}`);
    return response.data;
  },
  addComment: async (companyId: number, userId: number, content: string): Promise<Comment> => {
    const response = await axios.post<Comment>(
      `${API_BASE_URL}/comments`,
      {},
      {
        params: {
          companyId,
          userId,
          content,
        },
      }
    );
    return response.data;
  },
};