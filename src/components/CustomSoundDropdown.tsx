import { useState, useEffect, useRef } from 'react';

const sounds = [
  { label: 'Digital Bells', value: 'digital-bells.mp3' },
  { label: 'Frog', value: 'frog.mp3' },
  { label: 'Wooden Block', value: 'wooden-block.mp3' },
  { label: 'Paper Crumple', value: 'paper-crumple.mp3' },
];

export default function CustomSoundDropdown({ onChange, defaultValue }: { onChange: (value: string) => void; defaultValue: string }) {
  const [selectedSound, setSelectedSound] = useState<string>(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedSound(defaultValue);
  }, [defaultValue]);

  const handlePlaySound = (soundFile: string) => {
    const audio = new Audio(`/sounds/${soundFile}`);
    setPlayingSound(soundFile);
    audio.play();
    audio.addEventListener('ended', () => {
      setPlayingSound(null);
    });
  };

  const handleChange = (value: string) => {
    setSelectedSound(value);
    onChange(value);
    setIsOpen(false);
  };

  const selectedSoundLabel = sounds.find(sound => sound.value === selectedSound)?.label || 'Select Sound';

  return (
    <div className="space-y-3" ref={dropdownRef}>
      <label className="block">
        <span className="text-gray-700">Completed Sound Effect</span>
        <div className="relative mt-1">
          <button
            type="button"
            className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="block truncate text-gray-900">{selectedSoundLabel}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
              {sounds.map((sound) => (
                <div
                  key={sound.value}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer group"
                >
                  <div
                    className="flex-1 text-gray-900"
                    onClick={() => handleChange(sound.value)}
                  >
                    {sound.label}
                    {selectedSound === sound.value && (
                      <span className="ml-2 text-indigo-600">✓</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`ml-2 px-2 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${playingSound === sound.value ? 'text-indigo-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySound(sound.value);
                    }}
                  >
                    {playingSound === sound.value ? '⏸' : '▶'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </label>
    </div>
  );
}
