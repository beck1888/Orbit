import { useState } from 'react';

const sounds = [
  { label: 'Digital Bells', value: 'digital-bells.mp3' },
  { label: 'Frog', value: 'frog.mp3' },
  { label: 'Wooden Block', value: 'wooden-block.mp3' },
  { label: 'Paper Crumple', value: 'paper-crumple.mp3' },
];

export default function CustomSoundDropdown({ onChange, defaultValue }: { onChange: (value: string) => void; defaultValue: string }) {
  const [selectedSound, setSelectedSound] = useState<string>(defaultValue);

  const handlePlaySound = (soundFile: string) => {
    const audio = new Audio(`/public/sounds/${soundFile}`);
    audio.play();
  };

  const handleChange = (value: string) => {
    setSelectedSound(value);
    onChange(value);
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-gray-700">Completed Sound Effect</span>
        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          {sounds.map((sound) => (
            <div key={sound.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="soundEffect"
                value={sound.value}
                checked={selectedSound === sound.value}
                onChange={() => handleChange(sound.value)}
              />
              <span>{sound.label}</span>
              <button
                type="button"
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handlePlaySound(sound.value)}
              >
                Play
              </button>
            </div>
          ))}
        </div>
      </label>
    </div>
  );
}
