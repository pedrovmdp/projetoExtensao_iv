import React from "react";

const FormInput = React.forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      maxLength,
      className,
      error,
      ...rest // 🔥 aqui vem o register
    },
    ref
  ) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>

        <input
          ref={ref} // 🔥 ESSENCIAL
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          className={
            className ||
            `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              error ? "border-red-500" : "border-gray-300"
            }`
          }
          {...rest} // 🔥 register entra aqui
        />

        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

export default FormInput;