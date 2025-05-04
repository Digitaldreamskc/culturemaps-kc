'use client';

import { useState, FormEvent } from 'react';
import { LocationCategory } from '@/types/database';

interface FormData {
  name: string;
  category: LocationCategory;
  description: string;
  website: string;
  photoUrl: string;
  address: string;
  latitude: number;
  longitude: number;
  submittedBy: string;
  contactEmail: string;
  consent: boolean;
}

const initialFormData: FormData = {
  name: '',
  category: 'other',
  description: '',
  website: '',
  photoUrl: '',
  address: '',
  latitude: 0,
  longitude: 0,
  submittedBy: '',
  contactEmail: '',
  consent: false,
};

const categories: { value: LocationCategory; label: string }[] = [
  { value: 'mural', label: 'Mural' },
  { value: 'museum', label: 'Museum' },
  { value: 'music_venue', label: 'Music Venue' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'historic_place', label: 'Historic Place' },
  { value: 'theater', label: 'Theater' },
  { value: 'other', label: 'Other' },
];

export default function SubmitLocationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Location name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 300) {
      newErrors.description = 'Description must be 300 characters or less';
    }
    if (!formData.consent) {
      newErrors.consent = 'You must agree to the terms';
    }

    // Optional field validations
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit location');
      }

      const data = await response.json();
      console.log('Submission successful:', data);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData(initialFormData);
        setShowSuccess(false);
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      // You might want to show an error message to the user here
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Cultural Location</h2>
      
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">Thanks! Your submission will be reviewed.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Location Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description * (max 300 characters)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            maxLength={300}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            <p className="text-sm text-gray-500">
              {formData.description.length}/300 characters
            </p>
          </div>
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website or Social Media Link
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Photo URL */}
        <div>
          <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Photo URL
          </label>
          <input
            type="url"
            id="photoUrl"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
            placeholder="https://"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submitted By */}
        <div>
          <label htmlFor="submittedBy" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name or Alias
          </label>
          <input
            type="text"
            id="submittedBy"
            name="submittedBy"
            value={formData.submittedBy}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.contactEmail ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                errors.consent ? 'border-red-500' : ''
              }`}
            />
          </div>
          <div className="ml-3">
            <label htmlFor="consent" className="text-sm text-gray-700">
              I confirm this is a public cultural site and agree to share it with the community *
            </label>
            {errors.consent && (
              <p className="mt-1 text-sm text-red-600">{errors.consent}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full px-4 py-2 text-white font-medium rounded-lg
              ${isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-colors duration-200
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Location'}
          </button>
        </div>
      </form>
    </div>
  );
} 