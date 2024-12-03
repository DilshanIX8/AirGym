import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { transferZodErrors } from "../utils/transfer-zod-errors";
import BackToHomeButton from "../components/button/BackToHomeButton";
import { PiSpinnerBold } from "react-icons/pi";
import { errorToast } from "../utils/toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/auth/forgot-password", { email })
      .then(() => {
        setLoading(false);
        navigate("/reset-password?email=" + email);
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
          backgroundImage: "url(/images/bg/bg.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPositionX: "center",
        }}
      >
        {/* back to home */}
        <BackToHomeButton />
        <div className="max-h-[85%] w-[98%] overflow-y-auto rounded-xl border border-orange-400/40 bg-black/70 p-8 px-4 shadow-xl shadow-orange-700/10 drop-shadow-2xl backdrop-blur-lg sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-orange-400">
            Forgot Password?
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
                  value={email}
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

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full flex-row items-center justify-center rounded-md border border-none bg-orange-700 py-4 text-center text-sm text-white shadow-sm outline-none"
                >
                  {loading && (
                    <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
                  )}
                  Continue
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

export default ForgotPassword;
