import React from "react";

const Button = ({ name, className }) => {
  return (
    <div
      className={`flex justify-center bg-slate-50 items-center p-1.5 rounded  ${className}`}
    >
      <button>{name}</button>
    </div>
  );
};

export default Button;
