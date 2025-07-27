
'use client';

interface HeaderProps {
  currentClassName: string;
}

export default function Header({ currentClassName }: HeaderProps) {
  return (
    <div className="p-8 border-b border-gray-200 bg-white">
      <h2 className="text-3xl font-semibold">
        {currentClassName || 'Dashboard'}
      </h2>
    </div>
  );
}
