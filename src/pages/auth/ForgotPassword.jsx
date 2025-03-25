import { CentredContainer } from "../../components/auth/CentredContainer";
import { AuthBottomRedirect } from "../../components/auth/AuthBottomRedirect";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { NavLink } from "react-router-dom";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth(null);

  async function onSubmit(data) {
    try {
      setLoading(true);
      await resetPassword(data.email);
      setLoading(false);
      showSuccessToast("Check your inbox for further instructions.");
    } catch {
      setTimeout(() => {
        setLoading(false);
      }, 300);
      showErrorToast("Failed to reset the password.");
    }
  }

  return (
    <CentredContainer>
      <AuthHeader
        title="Reset password"
        subtitle="Fill up the form to get instructions"
      />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Email is not valid.",
                },
              })}
              type="text"
              autoComplete="email"
              placeholder="Email Address"
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                showErrors && errors.email ? "border-red-500" : ""
              }`}
            />
          </div>
          {showErrors && errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <button
            disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
            type="submit"
            onClick={() => setShowErrors(true)}
          >
            {loading && (
              <span
                className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              ></span>
            )}
            {!loading && "Reset Password"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-gray-700">
        Remember your password?{" "}
        <NavLink
          to="/login"
          className="font-semibold text-indigo-600 transition duration-200 hover:text-indigo-700"
        >
          Login
        </NavLink>
      </div>
    </CentredContainer>
  );
}
