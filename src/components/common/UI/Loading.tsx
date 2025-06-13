import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  overlay = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : overlay
    ? 'absolute inset-0 z-10'
    : '';

  const bgClasses = fullScreen || overlay
    ? 'bg-white bg-opacity-90'
    : '';

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        ${containerClasses}
        ${bgClasses}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <Loader2
        className={`
          animate-spin
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `.trim().replace(/\s+/g, ' ')}
      />
      {text && (
        <p className={`mt-4 text-sm ${colorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;