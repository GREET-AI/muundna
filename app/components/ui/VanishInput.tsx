'use client';

import { useState, useRef, useEffect } from 'react';

interface VanishInputProps {
  label: string;
  name?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function VanishInput({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur
}: VanishInputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasValue(!!value || !!inputRef.current?.value);
  }, [value]);

  const handleFocus = () => {
    setFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setFocused(false);
    if (onBlur) onBlur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className="relative">
      <label
        className={`absolute left-4 transition-all duration-300 pointer-events-none font-medium ${
          focused || hasValue
            ? 'top-2 text-xs text-[#cb530a] dark:text-[#182c30] font-semibold'
            : 'top-4 text-base text-gray-500 dark:text-gray-400'
        }`}
      >
        {label} {required && '*'}
      </label>
      <input
        ref={inputRef}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={focused ? placeholder : ''}
        required={required}
        className="w-full px-4 pt-6 pb-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:border-[#cb530a] dark:bg-gray-800 dark:text-white transition-all hover:border-gray-400 dark:hover:border-gray-600"
      />
    </div>
  );
}

