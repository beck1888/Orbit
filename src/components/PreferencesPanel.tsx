'use client';

import CustomSoundDropdown from './CustomSoundDropdown';

export default function PreferencesPanel() {
  return (
    <>
      <div className="bg-white border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
        <p className="text-gray-600 mt-1">Customize your experience</p>
      </div>

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
                  defaultChecked={true} // Defaults to yes
                  onChange={(e) => {
                    localStorage.setItem('playSound', e.target.checked ? 'yes' : 'no');
                  }}
                />
                <span className="text-gray-700">Play sound</span>
              </label>

              <CustomSoundDropdown
                defaultValue="digital-bells.mp3"
                onChange={(value) => {
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
                  defaultChecked={false} // Defaults to no
                  onChange={(e) => {
                    localStorage.setItem('showAssignmentTypeCount', e.target.checked ? 'yes' : 'no');
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