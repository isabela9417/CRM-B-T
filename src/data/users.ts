import { User } from '../types';

export interface LoginCredentials {
  username: string;
  password: string;
  user: User;
}

// In a real application, this would come from your backend API
export const LOGIN_CREDENTIALS: LoginCredentials[] = [
  { username: 'john.smith', password: 'password123', user: { id: '1', name: 'John Smith', email: 'john.smith@company.com' } },
  { username: 'sarah.johnson', password: 'password123', user: { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' } },
  { username: 'michael.brown', password: 'password123', user: { id: '3', name: 'Michael Brown', email: 'michael.brown@company.com' } },
  { username: 'emily.davis', password: 'password123', user: { id: '4', name: 'Emily Davis', email: 'emily.davis@company.com' } },
  { username: 'david.wilson', password: 'password123', user: { id: '5', name: 'David Wilson', email: 'david.wilson@company.com' } },
  { username: 'lisa.anderson', password: 'password123', user: { id: '6', name: 'Lisa Anderson', email: 'lisa.anderson@company.com' } },
  { username: 'james.taylor', password: 'password123', user: { id: '7', name: 'James Taylor', email: 'james.taylor@company.com' } },
  { username: 'jessica.white', password: 'password123', user: { id: '8', name: 'Jessica White', email: 'jessica.white@company.com' } },
  { username: 'robert.garcia', password: 'password123', user: { id: '9', name: 'Robert Garcia', email: 'robert.garcia@company.com' } },
  { username: 'amanda.martinez', password: 'password123', user: { id: '10', name: 'Amanda Martinez', email: 'amanda.martinez@company.com' } },
];

export const USERS: User[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@company.com' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@company.com' },
  { id: '4', name: 'Emily Davis', email: 'emily.davis@company.com' },
  { id: '5', name: 'David Wilson', email: 'david.wilson@company.com' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa.anderson@company.com' },
  { id: '7', name: 'James Taylor', email: 'james.taylor@company.com' },
  { id: '8', name: 'Jessica White', email: 'jessica.white@company.com' },
  { id: '9', name: 'Robert Garcia', email: 'robert.garcia@company.com' },
  { id: '10', name: 'Amanda Martinez', email: 'amanda.martinez@company.com' },
];