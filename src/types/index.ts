export interface User {
  id: number;
  name: string;
  firstname: string;
  surname: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Company {
  id: number;
  name: string;
  contactDetails: {
    email: string;
    phone: string;
    address: string;
    contactPerson: string;
  };
  assignedTo: number;
  assignedBy: number;
  contactDate: string;
  meetingDate: string;
  status: 'PENDING' | 'CLOSED' | 'ESCALATED';
  escalatedTo: number | null;
  notes?: string;
  createdAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  companyId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
}