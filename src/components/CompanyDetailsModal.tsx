import React, { useState } from 'react';
import { Company } from '../types';
import { X, Building2, Save, Edit2 } from 'lucide-react';

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
      {/* Modal container */}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg">
              {/* 🔴 Make icon red */}
              <Building2 className="w-6 h-6 text-red-600" />
            </div>
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
            // ----------------- EDIT MODE -----------------
            <div className="space-y-4">
              {[
                { label: 'Company Name', key: 'name', type: 'text' },
                { label: 'Contact Person', key: 'contactPerson', type: 'text' },
                { label: 'Phone Number', key: 'phone', type: 'tel' },
                { label: 'Email Address', key: 'email', type: 'email' },
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-800"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <p className="text-gray-900 font-medium">{company.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <p className="text-gray-900">{company.contactDetails.contactPerson}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-900">{company.contactDetails.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <p className="text-gray-900">{company.contactDetails.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p className="text-gray-900">{company.contactDetails.address}</p>
              </div>

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

/* ---------------- Company List Wrapper ---------------- */
interface CompanyListProps {
  companies: Company[];
  onUpdate: (id: number, updates: Partial<Company>) => void;
  canEdit: boolean;
}

export const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onUpdate,
  canEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Filter companies by search term
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show only 6 unless "view all" is active
  const visibleCompanies = viewAll ? filteredCompanies : filteredCompanies.slice(0, 6);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for a company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleCompanies.map((company) => (
          <div
            key={company.id}
            className="p-4 border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedCompany(company)}
          >
            <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
            <p className="text-sm text-gray-600">{company.contactDetails.contactPerson}</p>
          </div>
        ))}
      </div>

      {/* View All button */}
      {filteredCompanies.length > 6 && !viewAll && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setViewAll(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            View All
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onUpdate={onUpdate}
          canEdit={canEdit}
        />
      )}
    </div>
  );
};
