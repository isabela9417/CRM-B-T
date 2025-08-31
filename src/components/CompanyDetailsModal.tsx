import React, { useState } from 'react';
import { Company } from '../types';
import { X, Building2, Save, Edit2, AlertCircle } from 'lucide-react';

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
  const [errors, setErrors] = useState<string[]>([]);
  const [editForm, setEditForm] = useState({
    name: company.name,
    contactPerson: company.contactDetails.contactPerson,
    phone: company.contactDetails.phone,
    email: company.contactDetails.email,
    address: company.contactDetails.address,
    contactDate: company.contactDate || "",
    meetingDate: company.meetingDate || "",
    status: company.status,
    escalatedTo: company.escalatedTo || null,
    notes: company.notes || "",
  });

  // ✅ Validation function
  const validateForm = () => {
    const newErrors: string[] = [];

    if (!editForm.name.trim()) {
      newErrors.push("Company name is required");
    }
    if (editForm.email.trim() && !/\S+@\S+\.\S+/.test(editForm.email)) {
      newErrors.push("Please enter a valid email address");
    }
    if (editForm.phone.trim() && !/^\+?[0-9\s-]{7,15}$/.test(editForm.phone)) {
      newErrors.push("Please enter a valid phone number");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updates: Partial<Company> = {
      name: editForm.name,
      contactDetails: {
        ...company.contactDetails,
        contactPerson: editForm.contactPerson,
        phone: editForm.phone,
        email: editForm.email,
        address: editForm.address,
      },
      contactDate: editForm.contactDate,
      meetingDate: editForm.meetingDate,
      status: editForm.status,
      escalatedTo: editForm.status === "ESCALATED" ? editForm.escalatedTo : null,
      notes: editForm.notes,
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
      contactDate: company.contactDate || "",
      meetingDate: company.meetingDate || "",
      status: company.status,
      escalatedTo: company.escalatedTo || null,
      notes: company.notes || "",
    });
    setErrors([]);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-800">Company Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isEditing && canEdit ? (
            <div className="space-y-4">
              {/* Error messages */}
              {errors.length > 0 && (
                <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h3 className="text-sm font-medium text-red-600">
                      Please fix the following errors:
                    </h3>
                  </div>
                  <ul className="text-sm text-red-600 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Editable fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Company Name', key: 'name', type: 'text' },
                  { label: 'Contact Person', key: 'contactPerson', type: 'text' },
                  { label: 'Phone Number', key: 'phone', type: 'tel' },
                  { label: 'Email Address', key: 'email', type: 'email' },
                  { label: 'Contact Date', key: 'contactDate', type: 'date' },
                  { label: 'Meeting Date', key: 'meetingDate', type: 'date' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={(editForm as any)[field.key]}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [field.key]: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-800"
                    />
                  </div>
                ))}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as Company["status"],
                        escalatedTo: e.target.value !== "ESCALATED" ? null : editForm.escalatedTo,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CLOSED">Closed</option>
                    <option value="ESCALATED">Escalated</option>
                  </select>
                </div>

                {/* Escalate To */}
                {editForm.status === "ESCALATED" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Escalate To (User ID)</label>
                    <input
                      type="number"
                      value={editForm.escalatedTo || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          escalatedTo: Number(e.target.value) || null,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                />
              </div>

              {/* Save / Cancel */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // ----------------- VIEW MODE -----------------
            <div className="space-y-4">
              <p><strong>Company Name:</strong> {company.name}</p>
              <p><strong>Contact Person:</strong> {company.contactDetails.contactPerson}</p>
              <p><strong>Phone:</strong> {company.contactDetails.phone}</p>
              <p><strong>Email:</strong> {company.contactDetails.email}</p>
              <p><strong>Address:</strong> {company.contactDetails.address}</p>
              <p><strong>Contact Date:</strong> {company.contactDate}</p>
              <p><strong>Meeting Date:</strong> {company.meetingDate}</p>
              <p><strong>Status:</strong> {company.status}</p>
              {company.status === "ESCALATED" && (
                <p><strong>Escalated To:</strong> {company.escalatedTo}</p>
              )}
              <p><strong>Notes:</strong> {company.notes}</p>

              {canEdit && (
                <div className="pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
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
