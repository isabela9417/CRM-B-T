import React, { useState } from 'react';
import { Company, User } from '../types';
import { Building2, Calendar, Phone, Mail, MapPin, User as UserIcon, Edit2, Check, X, MessageCircle } from 'lucide-react';
import { CompanyDetailsModal } from './CompanyDetailsModal';
import { CommentsModal } from './CommentsModal';

interface CompanyCardProps {
  company: Company;
  users: User[];
  currentUser: User;
  onUpdate: (id: number, updates: Partial<Company>) => void;
  onAddComment?: (companyId: number, content: string) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  users,
  currentUser,
  onUpdate,
  onAddComment,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [editForm, setEditForm] = useState({
    status: company.status.toUpperCase() as Company['status'], 
    escalatedTo: company.escalatedTo || (null as number | null), 
    meetingDate: company.meetingDate,
    notes: company.notes || '',
  });

  const assignedUser = users.find(u => u.id === company.assignedTo);
  const escalatedUser = users.find(u => u.id === company.escalatedTo);
  const canEdit = company.assignedTo === currentUser.id || company.escalatedTo === currentUser.id;

  const handleSave = () => {
    const updatesToSend: Partial<Company> = {
      ...editForm,
      escalatedTo: editForm.status !== 'ESCALATED' ? null : editForm.escalatedTo,
    };
    onUpdate(company.id, updatesToSend);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      status: company.status,
      escalatedTo: company.escalatedTo || null,
      meetingDate: company.meetingDate,
      notes: company.notes || '',
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CLOSED':
        return 'bg-status-closed-bg text-status-closed border-status-closed/20';
      case 'PENDING':
        return 'bg-status-pending-bg text-status-pending border-status-pending/20';
      case 'ESCALATED':
        return 'bg-status-escalated-bg text-status-escalated border-status-escalated/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-crm-primary p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-crm-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">{company.name}</h3>
              <p className="text-sm text-muted-foreground">{company.contactDetails.contactPerson}</p>
            </div>
          </div>
          
          {canEdit && (
            <div className="flex space-x-1">
              <button
                onClick={() => setShowCommentsModal(true)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                title="View Comments"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-muted-foreground hover:text-card-foreground transition-colors"
                title="Edit Company"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3 text-sm">
            <UserIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Assigned to: <span className="font-medium text-card-foreground">{assignedUser?.name}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Meeting: <span className="font-medium text-card-foreground">{new Date(company.meetingDate).toLocaleDateString()}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{company.contactDetails.phone}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{company.contactDetails.email}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span 
              className="text-muted-foreground cursor-pointer hover:text-primary" 
              onClick={() => setShowDetailsModal(true)}
            >
              {company.contactDetails.address}
            </span>
          </div>
        </div>

        {isEditing && canEdit ? (
          <div className="space-y-4 border-t border-border pt-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => {
                  const newStatus = e.target.value as Company['status'];
                  setEditForm({
                    ...editForm,
                    status: newStatus,
                    escalatedTo: newStatus !== 'ESCALATED' ? null : editForm.escalatedTo
                  });
                }}
                className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm bg-background"
              >
                <option value="PENDING">Pending</option>
                <option value="CLOSED">Closed</option>
                <option value="ESCALATED">Escalated</option>
              </select>
            </div>

            {editForm.status === 'ESCALATED' && (
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Escalate to</label>
                <select
                  value={editForm.escalatedTo || ''}
                  onChange={(e) => setEditForm({ ...editForm, escalatedTo: Number(e.target.value) || null })}
                  className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm bg-background"
                >
                  <option value="">Select user...</option>
                  {users.filter(u => u.id !== currentUser.id).map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Meeting Date</label>
              <input
                type="date"
                value={editForm.meetingDate}
                onChange={(e) => setEditForm({ ...editForm, meetingDate: e.target.value })}
                className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Notes</label>
              <textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add notes about the company or meeting..."
                className="w-full p-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm bg-background"
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-crm-primary text-crm-primary-foreground py-2 px-4 rounded-lg hover:bg-crm-primary-hover transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(company.status)}`}>
              {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
            </span>
            
            {company.escalatedTo && (
              <span className="text-xs text-muted-foreground">
                Escalated to: {escalatedUser?.name}
              </span>
            )}
          </div>
        )}
      </div>
      
      {showDetailsModal && (
        <CompanyDetailsModal
          company={company}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={onUpdate}
          canEdit={canEdit}
        />
      )}
      
      {showCommentsModal && (
        <CommentsModal
          company={company}
          users={users}
          currentUser={currentUser}
          onClose={() => setShowCommentsModal(false)}
          onAddComment={onAddComment}
        />
      )}
    </div>
  );
};