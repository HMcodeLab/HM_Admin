// components/InputBoxs.tsx
import React, { ChangeEvent } from "react";

interface Props {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<Props> = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="font-semibold text-gray-700">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={onChange}
      className="rounded-md border p-2"
    />
  </div>
);

export default InputBox;
