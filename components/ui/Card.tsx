
import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default Card;
