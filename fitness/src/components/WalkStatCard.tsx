import React from "react";

interface CardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: string;
  progress?: number;
}

export default function WalkStatCard({ title, value, subtitle, icon, progress }: CardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-white/20 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
      
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
