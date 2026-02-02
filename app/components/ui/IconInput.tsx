'use client';

import { ReactNode } from 'react';

interface IconInputProps {
  icon: ReactNode;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function IconInput({
  icon,
  name,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange
}: IconInputProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-[#cb530a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:border-[#cb530a] transition-all text-gray-800 placeholder-gray-400"
      />
    </div>
  );
}

