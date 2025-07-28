'use client';

import { useState } from 'react';

interface AddClassFormProps {
  onSubmit: (className: string, classEmoji: string) => void;
  onCancel: () => void;
}

export default function AddClassForm({ onSubmit, onCancel }: AddClassFormProps) {
  function isTitleCase(str: string) {
    // Each word should start with uppercase followed by lowercase
    return str.split(' ').every(word => word.length === 0 || (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()));
  }
  const [className, setClassName] = useState('');
  const [classEmoji, setClassEmoji] = useState('');
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

  const handleEmojiClick = (emoji: string) => {
    setClassEmoji(emoji);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (className.trim() && classEmoji.trim()) {
      onSubmit(className.trim(), classEmoji.trim());
      setClassName('');
      setClassEmoji('');
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
        <label className="block mb-2 text-base font-medium">Choose an emoji:</label>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {emojiOptions.map((emoji) => (
            <button
              type="button"
              key={emoji}
              className={`p-2 text-2xl rounded-lg border transition-colors focus:outline-none ${classEmoji === emoji ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
              onClick={() => handleEmojiClick(emoji)}
              aria-label={`Select emoji ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
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
