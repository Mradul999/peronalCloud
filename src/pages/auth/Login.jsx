import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CentredContainer } from "../../components/auth/CentredContainer";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { AuthBottomRedirect } from "../../components/auth/AuthBottomRedirect";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { showErrorToast } from "../../utils/toast";
import { Mail } from "lucide-react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showErrors, setShowErrors] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      setLoading(true);
      await login(data.email, data.password);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);  
      let errorMessage = "Failed to log in.";
      
      console.error("Login error:", error.code, error.message);
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network connection issue. Please check your internet connection and try again.";
          break;
        case 'auth/timeout':
          errorMessage = "The request timed out. Please try again.";
          break;
        default:
          errorMessage = `Login failed: ${error.message}`;
      }
      
      showErrorToast(errorMessage);
    }
  }

  return (
    <CentredContainer>
      <AuthHeader title="Login" subtitle="Hi, Welcome back 👋" />

      {/* <div>
        <button className="my-3 flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-200 py-3 text-center text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="h-6 w-6"
            alt=""
          />{" "}
          <span>Login with Google</span>
        </button>
      </div>

      <span className="w-full text-center text-lg text-slate-500">Or</span> */}

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
                  message: "Email is not valid",
                },
              })}
              type="text"
              autoComplete="email"
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
                required: "Password is required",
              }),
              placeholder: "Enter Password",
              autoComplete: "current-password",
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

        <div className="text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot Password?
          </Link>
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
              "Login"
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-gray-700">
          Not registered yet?{" "}
          <NavLink
            to="/signup"
            className="font-semibold text-indigo-600 transition duration-200 hover:text-indigo-700"
          >
            Register now
          </NavLink>
        </div>
      </form>
    </CentredContainer>
  );
}
