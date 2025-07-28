'use client';

import Image from 'next/image';

interface StatsCardProps {
  icon: string;
  iconAlt: string;
  title: string;
  count: number;
  bgColor: string;
  textColor: string;
}

export default function StatsCard({ 
  icon, 
  iconAlt, 
  title, 
  count, 
  bgColor, 
  textColor 
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColor} ${textColor}`}>
          <Image src={icon} alt={iconAlt} width={24} height={24} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
      </div>
    </div>
  );
}