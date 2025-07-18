import React, { useState } from 'react';
import { Company, User } from '../types';
import { Building2, Calendar, Phone, Mail, MapPin, User as UserIcon, Edit2, Check, X } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
  users: User[];
  currentUser: User;
  onUpdate: (id: string, updates: Partial<Company>) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  users,
  currentUser,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: company.status,
    escalatedTo: company.escalatedTo || '',
    meetingDate: company.meetingDate,
    notes: company.notes || '',
  });

  const assignedUser = users.find(u => u.id === company.assignedTo);
  const canEdit = company.assignedTo === currentUser.id;

  const handleSave = () => {
    onUpdate(company.id, editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      status: company.status,
      escalatedTo: company.escalatedTo || '',
      meetingDate: company.meetingDate,
      notes: company.notes || '',
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">{company.name}</h3>
              <p className="text-sm text-gray-600">{company.contactDetails.contactPerson}</p>
            </div>
          </div>
          
          {canEdit && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3 text-sm">
            <UserIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Assigned to: <span className="font-medium text-black">{assignedUser?.name}</span></span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              Meeting: <span className="font-medium text-black">{new Date(company.meetingDate).toLocaleDateString()}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{company.contactDetails.phone}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{company.contactDetails.email}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{company.contactDetails.address}</span>
          </div>
        </div>

        {isEditing && canEdit ? (
          <div className="space-y-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>

            {editForm.status === 'escalated' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Escalate to</label>
                <select
                  value={editForm.escalatedTo}
                  onChange={(e) => setEditForm({ ...editForm, escalatedTo: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                >
                  <option value="">Select user...</option>
                  {users.filter(u => u.id !== currentUser.id).map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Date</label>
              <input
                type="date"
                value={editForm.meetingDate}
                onChange={(e) => setEditForm({ ...editForm, meetingDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add notes about the company or meeting..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between border-t pt-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(company.status)}`}>
              {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
            </span>
            
            {company.escalatedTo && (
              <span className="text-xs text-gray-600">
                Escalated to: {users.find(u => u.id === company.escalatedTo)?.name}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};