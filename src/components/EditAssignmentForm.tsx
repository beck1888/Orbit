'use client';

import { useState, useRef, useEffect } from 'react';
import { formatDateInput, formatTimeInput } from '@/utils/dateTimeHelpers';
import { Assignment } from '@/utils/database';

interface EditAssignmentFormProps {
  assignment: Assignment;
  onSubmit: (assignmentData: {
    title: string;
    description: string;
    type: string;
    dueDate?: string;
  }) => void;
  onCancel: () => void;
}

export default function EditAssignmentForm({ assignment, onSubmit, onCancel }: EditAssignmentFormProps) {
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description || '');
  const [type, setType] = useState(assignment.type);
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [isoDate, setIsoDate] = useState('');
  const [timeISO, setTimeISO] = useState('');

  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Initialize date and time values from existing assignment
  useEffect(() => {
    if (assignment.dueDate) {
      const dueDate = new Date(assignment.dueDate);
      if (!isNaN(dueDate.getTime())) {
        // Format the date for display (Month name, day, year)
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = monthNames[dueDate.getMonth()];
        const day = dueDate.getDate();
        const year = dueDate.getFullYear();
        setDateValue(`${month} ${day}, ${year}`);
        setIsoDate(dueDate.toISOString().split('T')[0]);

        // Format the time for display
        const hours = dueDate.getHours();
        const minutes = dueDate.getMinutes();
        if (hours !== 23 || minutes !== 59) { // Don't show time if it's the default 23:59
          const period = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          const displayMinutes = minutes.toString().padStart(2, '0');
          setTimeValue(`${displayHours}:${displayMinutes} ${period}`);
          setTimeISO(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        }
      }
    }
  }, [assignment.dueDate]);

  const handleDateBlur = () => {
    if (!dateValue.trim()) return;
    
    const result = formatDateInput(dateValue);
    if (result.success && result.formatted && result.isoDate) {
      setDateValue(result.formatted);
      setIsoDate(result.isoDate);
      if (dateInputRef.current) {
        dateInputRef.current.style.borderColor = '#10b981';
        dateInputRef.current.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        setTimeout(() => {
          if (dateInputRef.current) {
            dateInputRef.current.style.borderColor = '';
            dateInputRef.current.style.boxShadow = '';
          }
        }, 2000);
      }
    } else {
      if (dateInputRef.current) {
        dateInputRef.current.style.borderColor = '#ef4444';
        dateInputRef.current.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        setTimeout(() => {
          if (dateInputRef.current) {
            dateInputRef.current.style.borderColor = '';
            dateInputRef.current.style.boxShadow = '';
          }
        }, 2000);
      }
    }
  };

  const handleTimeBlur = () => {
    if (!timeValue.trim()) return;
    
    const result = formatTimeInput(timeValue);
    if (result.success && result.formatted && result.time) {
      setTimeValue(result.formatted);
      setTimeISO(result.time);
      if (timeInputRef.current) {
        timeInputRef.current.style.borderColor = '#10b981';
        timeInputRef.current.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        setTimeout(() => {
          if (timeInputRef.current) {
            timeInputRef.current.style.borderColor = '';
            timeInputRef.current.style.boxShadow = '';
          }
        }, 2000);
      }
    } else {
      if (timeInputRef.current) {
        timeInputRef.current.style.borderColor = '#ef4444';
        timeInputRef.current.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        setTimeout(() => {
          if (timeInputRef.current) {
            timeInputRef.current.style.borderColor = '';
            timeInputRef.current.style.boxShadow = '';
          }
        }, 2000);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter an assignment title');
      return;
    }

    if (!type) {
      alert('Please select an assignment type');
      return;
    }

    let dueDate: string | undefined;
    if (isoDate) {
      if (timeISO) {
        dueDate = `${isoDate}T${timeISO}:00`;
      } else {
        dueDate = `${isoDate}T23:59:59`;
      }
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      type,
      dueDate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Assignment title"
        className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[80px]"
      />

      <div className="space-y-2">
        <label htmlFor="assignment-type" className="block font-medium text-gray-700">
          Assignment Type:
        </label>
        <select
          id="assignment-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="Homework">Homework</option>
          <option value="Projects">Projects</option>
          <option value="Exams">Exams</option>
        </select>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <label htmlFor="assignment-date" className="block font-medium text-gray-700">
            Due Date:
          </label>
          <input
            ref={dateInputRef}
            type="text"
            id="assignment-date"
            value={dateValue}
            onChange={(e) => {
              setDateValue(e.target.value);
              if (!e.target.value.trim()) {
                setIsoDate('');
              }
            }}
            onBlur={handleDateBlur}
            placeholder="e.g., April 24 or 4/24"
            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="assignment-time" className="block font-medium text-gray-700">
            Due Time (optional):
          </label>
          <input
            ref={timeInputRef}
            type="text"
            id="assignment-time"
            value={timeValue}
            onChange={(e) => {
              setTimeValue(e.target.value);
              if (!e.target.value.trim()) {
                setTimeISO('');
              }
            }}
            onBlur={handleTimeBlur}
            placeholder="e.g., 3:30pm or 15:30"
            className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Update Assignment
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
