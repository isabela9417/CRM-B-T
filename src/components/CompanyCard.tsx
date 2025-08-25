// CompanyCard.tsx
import React, { useState } from 'react';
import { Company, User } from '../types';
import { Building2, Calendar, Phone, Mail, MapPin, User as UserIcon, Edit2, MessageCircle } from 'lucide-react';
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const canEdit = company.assignedTo === currentUser.id;

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border">
      <div className="p-6">
        {/* Header */}
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

          {/* Actions */}
          <div className="flex space-x-2">
            {/* 💬 Comments */}
            <button
              onClick={() => setShowCommentsModal(true)}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              title="View Comments"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* ✏️ Edit (next to comment icon) */}
            {canEdit && (
              <button
                onClick={() => setShowDetailsModal(true)}
                className="p-2 text-muted-foreground hover:text-card-foreground transition-colors"
                title="Edit Company"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Basic Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3 text-sm">
            <UserIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Added by: <span className="font-medium text-card-foreground">
                {users.find(u => u.id === company.assignedTo)?.name}
              </span>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Meeting:{" "}
              <span className="font-medium text-card-foreground">
                {company.meetingDate ? new Date(company.meetingDate).toLocaleDateString() : "Not set"}
              </span>
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
            <span className="text-muted-foreground">{company.contactDetails.address}</span>
          </div>
        </div>
      </div>

      {/* Modals */}
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
