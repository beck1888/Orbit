import { useEffect } from 'react';

interface SettingsManagerMenuProps {
  selectedSection: string;
  onSelectSection: (section: string) => void;
  onClose: () => void;
}

const SettingsManagerMenu: React.FC<SettingsManagerMenuProps> = ({ selectedSection, onSelectSection, onClose }) => {
  const sections = [
    { id: 'history', label: 'History' },
    { id: 'class-management', label: 'Class Management' },
    { id: 'preferences', label: 'Settings' },
    { id: 'data', label: 'Data' },
  ];

  useEffect(() => {
    localStorage.setItem('playSFX', JSON.stringify(true)); // Controlled by Play Sound checkbox
    localStorage.setItem('showAssignmentTypeCount', JSON.stringify(true));
  }, []);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage</h1>
        <button
          className="text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          {sections.map((section) => (
            <div key={section.id} className="mb-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => onSelectSection(section.id)}
              >
                {section.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsManagerMenu;
