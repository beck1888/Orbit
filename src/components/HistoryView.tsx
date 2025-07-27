'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Assignment, Class, AssignmentDatabase } from '@/utils/database';

interface HistoryViewProps {
  db: AssignmentDatabase | null;
}

export default function HistoryView({ db }: HistoryViewProps) {
  const [completedAssignments, setCompletedAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    const loadCompletedAssignments = async () => {
      if (!db) return;

      try {
        setIsLoading(true);
        const [completed, allClasses] = await Promise.all([
          db.getAllCompletedAssignments(),
          db.getAllClasses()
        ]);
        setCompletedAssignments(completed);
        setClasses(allClasses);
      } catch (error) {
        console.error('Failed to load completed assignments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletedAssignments();
  }, [db]);

  const handleToggleCompletion = async (assignmentId: number, completed: boolean) => {
    if (!db) return;

    try {
      await db.updateAssignment(assignmentId, { completed });
      // Reload the completed assignments to reflect the change
      const updatedCompleted = await db.getAllCompletedAssignments();
      setCompletedAssignments(updatedCompleted);
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const getClassName = (classId: number) => {
    const foundClass = classes.find(c => c.id === classId);
    return foundClass ? foundClass.name : 'Unknown Class';
  };

  const getClassEmoji = (classId: number) => {
    const foundClass = classes.find(c => c.id === classId);
    return foundClass ? foundClass.emoji : '📚';
  };

  const formatCompletedDate = (dateString?: string) => {
    if (!dateString) return 'No completion date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter assignments based on selected filter
  const filteredAssignments = completedAssignments.filter(assignment => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'homework') return assignment.type?.toLowerCase() === 'homework';
    if (selectedFilter === 'projects') return assignment.type?.toLowerCase() === 'projects';
    if (selectedFilter === 'exams') return assignment.type?.toLowerCase() === 'exams';
    if (selectedFilter === 'other') return !['homework', 'projects', 'exams'].includes(assignment.type?.toLowerCase() || '');
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading completed assignments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Filter by Type</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Types', count: completedAssignments.length },
            { key: 'homework', label: 'Homework', count: completedAssignments.filter(a => a.type?.toLowerCase() === 'homework').length },
            { key: 'projects', label: 'Projects', count: completedAssignments.filter(a => a.type?.toLowerCase() === 'projects').length },
            { key: 'exams', label: 'Exams', count: completedAssignments.filter(a => a.type?.toLowerCase() === 'exams').length },
            { key: 'other', label: 'Other', count: completedAssignments.filter(a => !['homework', 'projects', 'exams'].includes(a.type?.toLowerCase() || '')).length }
          ].map(filter => (
            filter.count > 0 && (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            )
          ))}
        </div>
      </div>

      {/* Completed Assignments List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">
            Completed Assignments ({filteredAssignments.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Click the checkbox to mark as incomplete and move back to active tasks
          </p>
        </div>
        
        <div className="p-4">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {selectedFilter === 'all' 
                ? 'No completed assignments yet. Keep working on your tasks!'
                : `No completed ${selectedFilter} assignments.`
              }
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAssignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{getClassEmoji(assignment.classId)}</span>
                        <h4 className="font-semibold text-gray-900">{getClassName(assignment.classId)}</h4>
                      </div>
                      {assignment.description && (
                        <p className="text-gray-600 text-sm mb-2">{assignment.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>✅ Completed: {formatCompletedDate(assignment.completedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleCompletion(assignment.id!, false)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                        title="Put Back"
                      >
                        <Image src="/icons/undo.svg" alt="Undo" width={16} height={16} />
                        <span>Undo</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
