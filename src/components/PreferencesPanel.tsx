'use client';

import { useEffect, useState } from 'react';
import CustomSoundDropdown from './CustomSoundDropdown';

export default function PreferencesPanel() {
  const [playSFX, setPlaySFX] = useState(true);
  const [showAssignmentTypeCount, setShowAssignmentTypeCount] = useState(true);
  const [completedSoundEffect, setCompletedSoundEffect] = useState('digital-bells.mp3');

  useEffect(() => {
    // Initialize state from localStorage
    const savedPlaySFX = JSON.parse(localStorage.getItem('playSFX') || 'true');
    const savedShowAssignmentTypeCount = JSON.parse(localStorage.getItem('showAssignmentTypeCount') || 'true');
    const savedCompletedSoundEffect = localStorage.getItem('completedSoundEffect') || 'digital-bells.mp3';

    setPlaySFX(savedPlaySFX);
    setShowAssignmentTypeCount(savedShowAssignmentTypeCount);
    setCompletedSoundEffect(savedCompletedSoundEffect);
  }, []);

  return (
    <>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sound Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Sound Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={playSFX}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setPlaySFX(newValue);
                    localStorage.setItem('playSFX', JSON.stringify(newValue));
                  }}
                />
                <span className="text-gray-700">Play sound</span>
              </label>

              <CustomSoundDropdown
                defaultValue={completedSoundEffect}
                onChange={(value) => {
                  setCompletedSoundEffect(value);
                  localStorage.setItem('completedSoundEffect', value);
                }}
              />
            </div>
          </div>

          {/* Assignment Type Count Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Assignment Type Count</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showAssignmentTypeCount}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setShowAssignmentTypeCount(newValue);
                    localStorage.setItem('showAssignmentTypeCount', JSON.stringify(newValue));
                  }}
                />
                <span className="text-gray-700">Show assignment type count</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}