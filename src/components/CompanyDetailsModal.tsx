import React, { useState } from 'react';
import { Company } from '../types';
import { X, Building2, Save } from 'lucide-react';

interface CompanyDetailsModalProps {
  company: Company;
  onClose: () => void;
  onUpdate: (id: number, updates: Partial<Company>) => void;
  canEdit: boolean;
}

export const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  company,
  onClose,
  onUpdate,
  canEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: company.name,
    contactPerson: company.contactDetails.contactPerson,
    phone: company.contactDetails.phone,
    email: company.contactDetails.email,
    address: company.contactDetails.address,
  });

  const handleSave = () => {
    const updates: Partial<Company> = {
      name: editForm.name,
      contactDetails: {
        ...company.contactDetails,
        contactPerson: editForm.contactPerson,
        phone: editForm.phone,
        email: editForm.email,
        address: editForm.address,
      },
    };
    onUpdate(company.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: company.name,
      contactPerson: company.contactDetails.contactPerson,
      phone: company.contactDetails.phone,
      email: company.contactDetails.email,
      address: company.contactDetails.address,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="bg-crm-primary p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-crm-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground">Company Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-card-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isEditing && canEdit ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Company Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Contact Person</label>
                <input
                  type="text"
                  value={editForm.contactPerson}
                  onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
                  className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-crm-primary text-crm-primary-foreground py-2 px-4 rounded-lg hover:bg-crm-primary-hover transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Company Name</label>
                <p className="text-foreground font-medium">{company.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Contact Person</label>
                <p className="text-foreground">{company.contactDetails.contactPerson}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Phone Number</label>
                <p className="text-foreground">{company.contactDetails.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Email Address</label>
                <p className="text-foreground">{company.contactDetails.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Address</label>
                <p className="text-foreground">{company.contactDetails.address}</p>
              </div>

              {canEdit && (
                <div className="pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-crm-primary text-crm-primary-foreground py-2 px-4 rounded-lg hover:bg-crm-primary-hover transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Edit Details</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};