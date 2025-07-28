'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateSlug, validateSlug, normalizeSlug } from '@/utils/slugHelpers';
import { AssignmentDatabase } from '@/utils/database';

interface AddClassFormProps {
  onSubmit: (className: string, classEmoji: string, classSlug: string) => void;
  onCancel: () => void;
  db: AssignmentDatabase | null;
}

export default function AddClassForm({ onSubmit, onCancel, db }: AddClassFormProps) {
  function isTitleCase(str: string) {
    // Each word should start with uppercase followed by lowercase
    return str.split(' ').every(word => word.length === 0 || (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()));
  }
  const [className, setClassName] = useState('');
  const [classEmoji, setClassEmoji] = useState('');
  const [classSlug, setClassSlug] = useState('');
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [emojiError, setEmojiError] = useState(false);
  const emojiOptions = [
    '📚', // Study grind / readings never end
    '💻', // Programming / tech / CS
    '🧪', // Lab class / science hell
    '🧠', // Mental overload / psych major energy
    '📈', // Business / stats / climbing the GPA curve

    '📝', // Essays / exams / note-taking marathon
    '📅', // Schedule-packed / planner girlie
    '☕',  // Coffee-fueled 3 AM homework sesh
    '💤', // Sleep-deprived / nap between lectures
    '🔥', // Hustle / stress / this class is on fire

    '💀', // Existential dread / “I’m failing”
    '🤡', // Clownery / "why did I take this class"
    '😭', // Crying in the library
    '🤖', // Emotionless grindset / auto-pilot mode
    '🧘', // Trying to stay zen / self-care attempt
  ];

  const validateSlugUniqueness = useCallback(async (slug: string) => {
    if (!db || !slug) {
      setSlugError('');
      return;
    }

    try {
      const isUnique = await db.isSlugUnique(slug);
      if (!isUnique) {
        setSlugError('This URL is already taken. Please choose a different one.');
      } else if (!validateSlug(slug)) {
        setSlugError('URL must contain only lowercase letters, numbers, and hyphens.');
      } else {
        setSlugError('');
      }
    } catch (error) {
      console.error('Error validating slug:', error);
    }
  }, [db]);

  // Auto-generate slug when class name changes (unless user has manually edited it)
  useEffect(() => {
    if (!isSlugEdited && className.trim()) {
      const generatedSlug = generateSlug(className);
      setClassSlug(generatedSlug);
      validateSlugUniqueness(generatedSlug);
    }
  }, [className, isSlugEdited, validateSlugUniqueness]);

  const handleSlugChange = (value: string) => {
    const normalizedSlug = normalizeSlug(value);
    setClassSlug(normalizedSlug);
    setIsSlugEdited(true);
    validateSlugUniqueness(normalizedSlug);
  };

  const handleEmojiClick = (emoji: string) => {
    setClassEmoji(emoji);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate emoji
    if (!classEmoji.trim()) {
      setEmojiError(true);
      return;
    }
    setEmojiError(false);
    
    // Validate slug
    if (slugError || !classSlug.trim()) {
      return;
    }
    
    if (className.trim() && classEmoji.trim() && classSlug.trim()) {
      onSubmit(className.trim(), classEmoji.trim(), classSlug.trim());
      setClassName('');
      setClassEmoji('');
      setClassSlug('');
      setIsSlugEdited(false);
    }
  }

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
      {!isTitleCase(className.trim()) && className.trim() && (
        <div className="text-red-600 text-sm mt-1">Class name should be in title case (e.g., Math, English)</div>
      )}
      
      <div>
        <label className="block mb-2 text-base font-medium">Class URL:</label>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">orbit.com/</span>
          <input
            type="text"
            value={classSlug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="bio-101"
            className={`flex-1 p-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:border-transparent ${
              slugError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            required
          />
        </div>
        {slugError && (
          <div className="text-red-600 text-sm mt-1">{slugError}</div>
        )}
        <div className="text-gray-500 text-xs mt-1">
          This will be the web address for your class (lowercase letters, numbers, and hyphens only)
        </div>
      </div>
      <div>
        <label className="block mb-2 text-base font-medium">Choose an emoji:</label>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {emojiOptions.map((emoji) => (
            <button
              type="button"
              key={emoji}
              className={`p-2 text-2xl rounded-lg border transition-colors focus:outline-none ${classEmoji === emoji ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
              onClick={() => { handleEmojiClick(emoji); setEmojiError(false); }}
              aria-label={`Select emoji ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        {emojiError && (
          <div className="text-red-600 text-sm mt-1">Please select an emoji for your class.</div>
        )}
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!className.trim() || !classEmoji.trim() || !classSlug.trim() || !!slugError}
          className="flex-1 bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Class
        </button>
      </div>
    </form>
  );
}
