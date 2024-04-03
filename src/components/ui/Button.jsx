import React from "react";

const Button = ({ name, className }) => {
  return (
    <button
      className={`flex justify-center bg-slate-50 items-center p-1.5 rounded  ${className}`}
    >
      {name}
    </button>
  );
};

export default Button;
