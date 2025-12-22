import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center h-7 rounded-full w-14 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#050C3A] ${
        checked ? "bg-[#050C3A]" : "bg-gray-400"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={checked ? "On" : "Off"}
    >
      <span
        className={`inline-block w-6 h-6 transform bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default Toggle;
