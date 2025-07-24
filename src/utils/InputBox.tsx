// components/utils/InputBox.tsx

import React from "react";

interface InputBoxProps {
  label: string;
  type: string;
  placeholder?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
}

const InputBox: React.FC<InputBoxProps> = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  disabled = false,
  id,
}) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <p className="font-Montserrat text-lg font-semibold text-white">
        {label}
      </p>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        disabled={disabled}
        onChange={onChange}
        className="rounded-lg border p-2 shadow-md focus:outline-none"
      />
    </div>
  );
};

export default InputBox;
