import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  label?: string;
  error?: string;
}

const Select: React.FC<SelectProps> = ({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  label,
  error,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-300 focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:border-transparent',
    outline: 'bg-transparent border border-gray-300 focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:border-transparent'
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={`select ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}
                   rounded-md transition-colors focus:outline-none`}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
};

export default Select;