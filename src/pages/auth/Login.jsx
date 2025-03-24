import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { CentredContainer } from "../../components/auth/CentredContainer";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { AuthBottomRedirect } from "../../components/auth/AuthBottomRedirect";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../../components/auth/PasswordInput";
import { useAlert } from "../../contexts/AlertContext";
import { ALERT_CLASSES } from "../../constants";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { showAlert } = useAlert();
  const [showErrors, setShowErrors] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function onSubmit(data) {
    try {
      setLoading(true);
      await login(data.email, data.password);
      setLoading(false);
      history.push("/");
    } catch {
      showAlert(ALERT_CLASSES.ERROR, "Failed to log in.");
      setTimeout(() => {
        setLoading(false);
      }, 300);
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

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="label">
            <span className="label-text text-base">Email</span>
          </label>
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
            className={
              "input input-bordered w-full" +
              (showErrors && errors.email ? " input-error" : "")
            }
          />
          {showErrors && errors.email && (
            <p className="text-error">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="label">
            <span className="label-text text-base">Password</span>
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
          {showErrors && errors.email && (
            <p className="text-error">{errors.password.message}</p>
          )}
        </div>

        <div className="link link-primary p-1 hover:text-neutral-900">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <button
          disabled={loading}
          className="btn btn-primary btn-block"
          type="submit"
          onClick={() => setShowErrors(true)}
        >
          {loading && <span className="loading loading-spinner" />}
          Login
        </button>

        <AuthBottomRedirect
          text="Not registered yet?"
          linkText="Register now"
          linkTo="/signup"
        />
      </form>
    </CentredContainer>
  );
}
