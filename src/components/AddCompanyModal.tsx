import React, { useState } from "react";
import { Company, User } from "../types";
import { X, AlertCircle } from "lucide-react";
import logo from "../../logo.png";

interface AddCompanyModalProps {
  users: User[];
  currentUser: User;
  assignedCompanies: Company[];
  onClose: () => void;
  onSubmit: (company: Omit<Company, "id" | "createdAt">) => void;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  users,
  currentUser,
  assignedCompanies,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    contactDetails: {
      email: "",
      phone: "",
      address: "",
      contactPerson: "",
    },
    assignedTo: currentUser.id,
    contactDate: new Date().toISOString().split("T")[0],
    meetingDate: "",
    status: "PENDING" as Company["status"],
    escalatedTo: null as number | null,
    notes: "",
    assignedBy: currentUser.id,
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (
      formData.contactDetails.email.trim() &&
      !/\S+@\S+\.\S+/.test(formData.contactDetails.email)
    ) {
      newErrors.push("Please enter a valid email address");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const submissionData = {
      ...formData,
      escalatedTo: formData.status !== "ESCALATED" ? null : formData.escalatedTo,
    };
    onSubmit(submissionData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="CRM Logo"
              className="h-10 w-auto"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactDetails.contactPerson}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactDetails: {
                      ...formData.contactDetails,
                      contactPerson: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.contactDetails.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactDetails: {
                      ...formData.contactDetails,
                      email: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.contactDetails.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactDetails: {
                      ...formData.contactDetails,
                      phone: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.contactDetails.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactDetails: {
                      ...formData.contactDetails,
                      address: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter company address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: Number(e.target.value) })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.id === currentUser.id ? "(You)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Date
              </label>
              <input
                type="date"
                value={formData.contactDate}
                onChange={(e) =>
                  setFormData({ ...formData, contactDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Date
              </label>
              <input
                type="date"
                value={formData.meetingDate}
                onChange={(e) =>
                  setFormData({ ...formData, meetingDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => {
                  const newStatus = e.target.value as Company["status"];
                  setFormData({
                    ...formData,
                    status: newStatus,
                    escalatedTo:
                      newStatus !== "ESCALATED" ? null : formData.escalatedTo,
                  });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="CLOSED">Closed</option>
                <option value="ESCALATED">Escalated</option>
              </select>
            </div>

            {formData.status === "ESCALATED" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escalate To
                </label>
                <select
                  value={formData.escalatedTo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      escalatedTo: Number(e.target.value) || null,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select user...</option>
                  {users
                    .filter((u) => u.id !== currentUser.id)
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Add Company
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};
