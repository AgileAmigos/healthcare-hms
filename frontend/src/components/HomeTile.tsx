import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface HomeTileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
}

const HomeTile: React.FC<HomeTileProps> = ({ icon, title, description, linkTo }) => {
  return (
    <Link
      to={linkTo}
      className="group flex flex-col justify-between p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-200 hover:border-red-300"
    >
      <div>
        {/* Icon changed from blue to red */}
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
          {icon}
        </div>
        {/* Title changed from gray to dark red */}
        <h3 className="text-xl font-semibold text-red-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      {/* Link text changed from blue to red */}
      <div className="mt-4 flex items-center text-red-600 font-medium">
        <span>Go to Section</span>
        <ChevronRight className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

export default HomeTile;