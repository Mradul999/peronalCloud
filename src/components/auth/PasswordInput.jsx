import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export function PasswordInput(params) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <input
        {...params.inputParams}
        className={
          "input input-bordered w-full pr-9" +
          (params.hasError ? " input-error" : "")
        }
        type={showPassword ? "text" : "password"}
      />
      <div
        className="absolute bottom-0 right-0 top-0 flex cursor-pointer items-center pr-3"
        onClick={() => setShowPassword((show) => !show)}
      >
        {showPassword ? (
          <EyeIcon size={15} className="stroke-slate-400" />
        ) : (
          <EyeOffIcon size={15} className="stroke-slate-400" />
        )}
      </div>
    </div>
  );
}
