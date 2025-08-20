import React, { useState } from 'react';
import { Company, User } from '../types';
import { X, Building2, AlertCircle } from 'lucide-react';

interface AddCompanyModalProps {
  users: User[];
  currentUser: User;
  assignedCompanies: Company[]; 
  onClose: () => void;
  onSubmit: (company: Omit<Company, 'id' | 'createdAt'>) => void;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  users,
  currentUser,
  assignedCompanies,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contactDetails: {
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
    },
    assignedTo: currentUser.id,
    contactDate: new Date().toISOString().split('T')[0],
    meetingDate: '',
    status: 'PENDING' as Company['status'], 
    escalatedTo: null as number | null,
    notes: '',
    assignedBy: currentUser.id,
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push('Company name is required');
    }

    const existingCompany = assignedCompanies.find(
      c => c.name.toLowerCase() === formData.name.toLowerCase().trim()
    );
    if (existingCompany) {
      const assignedUser = users.find(u => u.id === existingCompany.assignedTo);
      newErrors.push(`Company "${formData.name}" is already assigned to ${assignedUser?.name}`);
    }

    if (!formData.contactDetails.contactPerson.trim()) {
      newErrors.push('Contact person is required');
    }

    if (!formData.contactDetails.email.trim()) {
      newErrors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.contactDetails.email)) {
      newErrors.push('Please enter a valid email address');
    }

    if (!formData.contactDetails.phone.trim()) {
      newErrors.push('Phone number is required');
    }

    if (!formData.meetingDate) {
      newErrors.push('Meeting date is required');
    }

    if (formData.status === 'ESCALATED' && !formData.escalatedTo) {
      newErrors.push('Please select who to escalate to');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      escalatedTo: formData.status !== 'ESCALATED' ? null : formData.escalatedTo,
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="bg-crm-primary p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-crm-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground">Add New Company</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-card-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <h3 className="text-sm font-medium text-destructive">Please fix the following errors:</h3>
              </div>
              <ul className="text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                value={formData.contactDetails.contactPerson}
                onChange={(e) => setFormData({
                  ...formData,
                  contactDetails: { ...formData.contactDetails, contactPerson: e.target.value }
                })}
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.contactDetails.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contactDetails: { ...formData.contactDetails, email: e.target.value }
                })}
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.contactDetails.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contactDetails: { ...formData.contactDetails, phone: e.target.value }
                })}
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                placeholder="Enter phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.contactDetails.address}
                onChange={(e) => setFormData({
                  ...formData,
                  contactDetails: { ...formData.contactDetails, address: e.target.value }
                })}
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                placeholder="Enter company address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Assigned To
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: Number(e.target.value) })}
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.id === currentUser.id ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Contact Date
              </label>
              <input
                type="date"
                value={formData.contactDate}
                onChange={(e) => setFormData({ ...formData, contactDate: e.target.value })}
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Meeting Date *
              </label>
              <input
                type="date"
                value={formData.meetingDate}
                onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => {
                  const newStatus = e.target.value as Company['status'];
                  setFormData({
                    ...formData,
                    status: newStatus,
                    escalatedTo: newStatus !== 'ESCALATED' ? null : formData.escalatedTo
                  });
                }}
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
              >
                <option value="PENDING">Pending</option>
                <option value="CLOSED">Closed</option>
                <option value="ESCALATED">Escalated</option>
              </select>
            </div>

            {formData.status === 'ESCALATED' && (
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Escalate To *
                </label>
                <select
                  value={formData.escalatedTo || ''}
                  onChange={(e) => setFormData({ ...formData, escalatedTo: Number(e.target.value) || null })}
                  className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                >
                  <option value="">Select user...</option>
                  {users.filter(u => u.id !== currentUser.id).map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes about the company or meeting..."
                className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-secondary-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-crm-primary text-crm-primary-foreground rounded-lg hover:bg-crm-primary-hover transition-colors"
            >
              Add Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};