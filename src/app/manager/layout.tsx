'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 'my-classes', label: 'My Classes', path: '/manager/my-classes', description: 'Manage your classes and course information' },
    { id: 'preferences', label: 'Preferences', path: '/manager/preferences', description: 'Customize your application settings and preferences' },
    { id: 'data', label: 'Data', path: '/manager/data', description: 'Export and manage your application data' },
  ];

  const currentItem = menuItems.find(item => item.path === pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors mb-2 ${
                  pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Content Header */}
        {currentItem && (
          <div className="bg-white border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800">{currentItem.label}</h2>
            <p className="text-gray-600 mt-1">{currentItem.description}</p>
          </div>
        )}
        
        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}