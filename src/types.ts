export interface User {
  id: number;
  firstname: string;
  surname: string;
  contactNumber: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'; 
  name: string; 
}

export interface ContactDetails {
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
}

export interface Company {
  id: number; 
  name: string;
  contactDetails: ContactDetails;
  assignedTo: number; 
  assignedBy: number; 
  contactDate: string; 
  meetingDate: string; 
  status: 'PENDING' | 'CLOSED' | 'ESCALATED'; 
  escalatedTo?: number | null; 
  notes?: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  companyId: number;
  userId: number;
  content: string;
  createdAt: string;
}