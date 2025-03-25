import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { CentredContainer } from "../../components/auth/CentredContainer";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { AuthBottomRedirect } from "../../components/auth/AuthBottomRedirect";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { showErrorToast } from "../../utils/toast";
import { Mail } from "lucide-react";

export default function Signup() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showErrors, setShowErrors] = useState(false);
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      setLoading(true);
      await signup(data.email, data.password);
      setLoading(false);
      navigate("/");
    } catch (e) {
      if (e.message.endsWith("(auth/email-already-in-use).")) {
        showErrorToast("The email address is already in use by another account.");
      } else {
        showErrorToast("Failed to create an account.");
      }
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }

  return (
    <CentredContainer>
      <AuthHeader title="Sign Up" subtitle="Hi, Welcome 👋" />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Email is not valid.",
                },
              })}
              type="text"
              placeholder="Email Address"
              className={`block w-full rounded-lg border px-4 py-3 pl-10 text-gray-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                showErrors && errors.email ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
              }`}
            />
          </div>
          {showErrors && errors.email && (
            <p className="flex items-center text-sm text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <PasswordInput
            inputParams={{
              ...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters.",
                },
              }),
              placeholder: "Create Password",
            }}
            hasError={showErrors && errors.password}
          />
          {showErrors && errors.password && (
            <p className="flex items-center text-sm text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password Confirmation
          </label>
          <PasswordInput
            inputParams={{
              ...register("password_confirm", {
                required: "Please confirm your password.",
                validate: {
                  matchesPreviousPassword: (value) => {
                    const { password } = getValues();
                    return password === value || "Passwords do not match.";
                  },
                },
              }),
              placeholder: "Confirm Password",
            }}
            hasError={showErrors && errors.password_confirm}
          />
          {showErrors && errors.password_confirm && (
            <p className="flex items-center text-sm text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors.password_confirm.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            disabled={loading}
            className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
            type="submit"
            onClick={() => setShowErrors(true)}
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-gray-700">
        Already have an account?{" "}
        <NavLink
          to="/login"
          className="font-semibold text-indigo-600 transition duration-200 hover:text-indigo-700"
        >
          Log In
        </NavLink>
      </div>
    </CentredContainer>
  );
}
