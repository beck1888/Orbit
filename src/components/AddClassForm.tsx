'use client';

import { useState } from 'react';

interface AddClassFormProps {
  onSubmit: (className: string) => void;
  onCancel: () => void;
}

export default function AddClassForm({ onSubmit, onCancel }: AddClassFormProps) {
  const [className, setClassName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (className.trim()) {
      onSubmit(className.trim());
      setClassName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        placeholder="Class name (e.g., Math, English)"
        className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
        required
      />
      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Add Class
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
