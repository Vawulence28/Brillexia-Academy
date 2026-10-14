import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  let baseStyle = "px-4 py-2 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  let variants = {
    primary: "bg-[#142B55] text-white hover:bg-[#1d3d75] focus:ring-[#142B55]",
    gold: "bg-[#D4AF37] text-[#0F172A] hover:bg-[#c29f2e] focus:ring-[#D4AF37]",
    outline: "border border-[#142B55] text-[#142B55] hover:bg-[#142B55] hover:text-white focus:ring-[#142B55]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};