import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { transferZodErrors } from "../utils/transfer-zod-errors";
import BackToHomeButton from "../components/button/BackToHomeButton";
import { PiSpinnerBold } from "react-icons/pi";
import { errorToast } from "../utils/toastify";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const refs = useRef([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (index < refs.current.length - 1 && e.target.value !== "") {
      refs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("/auth/verify-email", {
        email: searchParams.get("email"),
        code: otp.join(""),
      })
      .then(({ data }) => {
        if (data.success) {
          setLoading(false);
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

  if (!searchParams.has("email") || searchParams.get("email").length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-center text-xl font-medium text-red-500">
          Email not found
        </h1>
      </div>
    );
  }

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
        <div className="max-h-[85%] w-[98%] overflow-y-auto rounded-xl border border-orange-400/40 bg-black/70 p-8 px-4 shadow-xl shadow-orange-700/10 drop-shadow-2xl backdrop-blur-lg sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-orange-400">
            Email Verification
          </h2>
          <div className="items-center text-sm font-medium text-gray-400">
            <p className="text-center">We have sent a code to your email</p>
          </div>
          {/* code form */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-16 pt-16">
              <div className="w-full">
                <div className="mx-auto flex w-full flex-row items-center justify-between gap-2">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="h-16 w-16">
                      <input
                        ref={(el) => (refs.current[index - 1] = el)}
                        className="flex h-full w-full items-center justify-center rounded-md border border-orange-400 bg-slate-900 px-5 text-center text-2xl font-semibold text-orange-400 outline-none"
                        type="text"
                        name={`otp-${index}`}
                        id={`otp-${index}`}
                        value={otp[index - 1]}
                        onChange={(e) => handleOtpChange(e, index - 1)}
                        maxLength="1"
                        autoComplete="off"
                      />
                    </div>
                  ))}
                </div>
                {/* error message */}
                {validationErrors?.code && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {validationErrors?.code}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full flex-row items-center justify-center rounded-md border border-none bg-orange-700 py-4 text-center text-sm text-white shadow-sm outline-none"
                >
                  {loading && (
                    <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
                  )}
                  Verify Account
                </button>
                {/* error message */}
                {errorMessage && (
                  <p className="mt-3 text-center text-sm font-medium text-red-500">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
