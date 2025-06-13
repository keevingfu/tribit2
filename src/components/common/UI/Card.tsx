import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  bordered?: boolean;
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerActions,
  footer,
  padding = 'md',
  shadow = 'sm',
  bordered = true,
  hoverable = false,
  className = '',
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const baseClasses = `
    bg-white rounded-lg
    ${shadowClasses[shadow]}
    ${bordered ? 'border border-gray-200' : ''}
    ${hoverable ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${baseClasses} ${className}`} onClick={onClick}>
      {(title || subtitle || headerActions) && (
        <div className={`${paddingClasses[padding]} ${footer ? 'border-b border-gray-200' : ''}`}>
          <div className="flex items-start justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {headerActions && (
              <div className="ml-4 flex-shrink-0">{headerActions}</div>
            )}
          </div>
        </div>
      )}
      
      <div className={padding === 'none' ? '' : paddingClasses[padding]}>
        {children}
      </div>
      
      {footer && (
        <div className={`${paddingClasses[padding]} bg-gray-50 rounded-b-lg border-t border-gray-200`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default React.memo(Card);