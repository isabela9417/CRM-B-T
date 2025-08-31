import React, { useState } from 'react';
import { Company, User } from '../types';
import {
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User as UserIcon,
  Edit2,
  MessageCircle,
  Trash2
} from 'lucide-react';
import { CompanyDetailsModal } from './CompanyDetailsModal';
import { CommentsModal } from './CommentsModal';

interface CompanyCardProps {
  company: Company;
  users: User[];
  currentUser: User;
  onUpdate: (id: number, updates: Partial<Company>) => void;
  onDelete: (id: number) => void; // ✅ Add onDelete prop
  onAddComment?: (companyId: number, content: string) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  users,
  currentUser,
  onUpdate,
  onDelete,
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
        <div className="bg-red-600 p-2 rounded-lg">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{company.name}</h3>
          <p className="text-sm text-muted-foreground">
            {company.contactDetails?.contactPerson || "N/A"}
          </p>
        </div>
      </div>


          {/* Actions */}
          <div className="flex space-x-2">
            {/* Comments */}
            <button
              onClick={() => setShowCommentsModal(true)}
              className="p-2 text-red-600 hover:text-red-800 transition-colors"
              title="View Comments"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Edit */}
            {canEdit && (
              <button
                onClick={() => setShowDetailsModal(true)}
                className="p-2 text-red-600 hover:text-red-800 transition-colors"
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
            <span className="text-muted-foreground">{company.contactDetails?.phone || "N/A"}</span>
          </div>

          <div className="flex items-center space-x-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{company.contactDetails?.email || "N/A"}</span>
          </div>

          <div className="flex items-center space-x-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{company.contactDetails?.address || "N/A"}</span>
          </div>
        </div>

        {/* Delete Button at Bottom */}
      {canEdit && company.id != null && (
        <div className="flex justify-end mt-4">
          <button
            onClick={async () => {
              const confirmed = window.confirm(
                `Are you sure you want to delete "${company.name}"?`
              );
              if (!confirmed) return;

              try {
                // Call the parent handler which will call the API and update state
                await onDelete(company.id);
              } catch (error) {
                console.error("Failed to delete company:", error);
                alert("Failed to delete company. Please try again.");
              }
            }}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
            title="Delete Company"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      )}

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
