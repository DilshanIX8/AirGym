import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { transferZodErrors } from "../utils/transfer-zod-errors";
import BackToHomeButton from "../components/button/BackToHomeButton";
import { PiSpinnerBold } from "react-icons/pi";
import { errorToast } from "../utils/toastify";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // clear errors
    setErrorMessage("");
    setValidationErrors({});

    setLoading(true);

    axios
      .post("/auth/login", formData)
      .then(({ data }) => {
        if (data.success) {
          setLoading(false);
          navigate(data?.redirectUrl, { replace: true });
        }else{
          navigate("/verify-email?email=" + formData.email);
        }
      })
      .catch((err) => {
        if (err.response.data.error) setErrorMessage(err.response.data.error);
        else if (err.response.data.errors)
          setValidationErrors(
            transferZodErrors(err.response.data.errors).error,
          );
        else errorToast("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="flex h-screen flex-1 flex-col items-center justify-center"
      style={{
        backgroundImage: "url(/images/bg/big.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* back to home */}
      <BackToHomeButton />
      {/* login form */}
      <div className="max-h-[85%] w-[98%] overflow-y-auto rounded-xl border border-orange-400/40 bg-black/70 p-8 px-4 shadow-xl shadow-orange-700/10 drop-shadow-2xl backdrop-blur-lg sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-orange-400">
          Welcome back!
        </h2>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-100"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full border-b border-orange-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-orange-600 focus:outline-none"
              />

              {/* error message */}
              {validationErrors?.email && (
                <p className="mt-1 text-sm font-medium text-red-500">
                  {validationErrors?.email}
                </p>
              )}
            </div>

            {/* password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-100"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-orange-400 hover:text-orange-600"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-2 w-full border-b border-orange-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-orange-600 focus:outline-none"
              />

              {/* error message */}
              {validationErrors?.password && (
                <p className="mt-1 text-sm font-medium text-red-500">
                  {validationErrors?.password}
                </p>
              )}
            </div>

            {/* submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600"
              >
                {loading && (
                  <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
                )}
                Sign in
              </button>
              {/* error message */}
              {errorMessage && (
                <p className="mt-3 text-center text-sm font-medium text-red-500">
                  {errorMessage}
                </p>
              )}
            </div>
          </form>

          {/* sign up redirection */}
          <div className="mt-10 text-center text-sm text-gray-200">
            Not a member?{" "}
            <Link
              to="/sign-up"
              className="font-semibold leading-6 text-orange-400 hover:text-orange-600"
            >
              Sign up now!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
