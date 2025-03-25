import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function PasswordInput(params) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <input
        {...params.inputParams}
        className={`block w-full rounded-lg border px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-12 ${
          params.hasError ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
        }`}
        type={showPassword ? "text" : "password"}
      />
      <button
        type="button"
        className="absolute bottom-0 right-0 top-0 flex cursor-pointer items-center justify-center px-3 text-gray-400 hover:text-gray-500"
        onClick={() => setShowPassword((show) => !show)}
      >
        {showPassword ? (
          <Eye className="h-5 w-5" />
        ) : (
          <EyeOff className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
