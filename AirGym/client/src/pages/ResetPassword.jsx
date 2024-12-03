import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackToHomeButton from "../components/button/BackToHomeButton";
import { transferZodErrors } from "../utils/transfer-zod-errors";
import { PiSpinnerBold } from "react-icons/pi";
import { errorToast, successToast } from "../utils/toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    if (name === "otp") setCode(value);
  };

  useEffect(() => {
    const email = params.get("email");
    if (!email) {
      navigate("/forgot-password");
    }
  }, [navigate, params]);

  const handleSubmit = async (e) => {
    const email = params.get("email");
    e.preventDefault();

    // Validate password and confirmPassword match
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    setLoading(true);

    axios
      .post("/auth/reset-password", { email, password, confirmPassword, code })
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          successToast("Password reset successfully. Please login.");
          navigate("/login");
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
    <div>
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
        <div className="max-h-[85%] w-[98%] overflow-y-auto rounded-xl border border-orange-400/40 bg-black/70 p-8 px-4 shadow-xl shadow-orange-700/10 drop-shadow-2xl backdrop-blur-lg sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-orange-400">
            Reset Password
          </h2>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* otp */}
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium leading-6 text-gray-100"
                >
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  autoComplete="new-otp"
                  required
                  value={code}
                  onChange={handleChange}
                  placeholder="xxxxxx"
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-100"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={handleChange}
                  placeholder="********"
                  className="mt-2 w-full border-b border-orange-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-orange-600 focus:outline-none"
                />

                {/* error message */}
                {validationErrors?.password && (
                  <p className="mt-1 text-sm font-medium text-red-500">
                    {validationErrors?.password}
                  </p>
                )}
              </div>

              {/* password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-100"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
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
                  className="flex w-full flex-row items-center justify-center rounded-md border border-none bg-orange-700 py-4 text-center text-sm text-white shadow-sm outline-none"
                >
                  {loading && (
                    <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
                  )}
                  Reset Password
                </button>
                {/* error message */}
                {errorMessage && (
                  <p className="mt-3 text-center text-sm font-medium text-red-500">
                    {errorMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
