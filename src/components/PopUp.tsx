'use client';

import { useEffect } from 'react';

interface PopUpProps {
  isOpen: boolean;
  title: string;
  message: string;
  dismissButtonLabel: string;
  primaryButtonLabel: string;
  onButtonClick: (buttonType: 'dismiss' | 'primary') => void;
}

export default function PopUp({ 
  isOpen, 
  title, 
  message, 
  dismissButtonLabel, 
  primaryButtonLabel, 
  onButtonClick 
}: PopUpProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onButtonClick('dismiss');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onButtonClick]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => onButtonClick('dismiss')}
    >
      <div 
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => onButtonClick('dismiss')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pr-8">{title}</h3>
        
        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        
        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onButtonClick('dismiss')}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            {dismissButtonLabel}
          </button>
          <button
            onClick={() => onButtonClick('primary')}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            {primaryButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
