import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { transferZodErrors } from "../utils/transfer-zod-errors";
import BackToHomeButton from "../components/button/BackToHomeButton";
import { FaCheckCircle } from "react-icons/fa";
import { PiSpinnerBold } from "react-icons/pi";
import { errorToast } from "../utils/toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "CLIENT",
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // clear errors
    setErrorMessage("");
    setValidationErrors({});

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }
    // set loading to true
    setLoading(true);

    axios
      .post("/auth/register", formData)
      .then(({ data }) => {
        if (data.success) {
          setLoading(false);
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
      {/* register form */}
      <div className="max-h-[85%] w-[98%] overflow-y-auto rounded-xl border border-orange-400/40 bg-black/70 p-8 px-4 shadow-xl shadow-orange-700/10 drop-shadow-2xl backdrop-blur-lg sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-orange-400">
          Create an Account
        </h2>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* names */}
            <div className="grid md:grid-cols-2 md:gap-4">
              {/* first name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-100"
                >
                  First Name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border-b border-orange-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-orange-600 focus:outline-none"
                />

                {/* error message */}
                {validationErrors?.firstName && (
                  <p className="mt-1 text-sm font-medium text-red-500">
                    {validationErrors?.firstName}
                  </p>
                )}
              </div>
              {/* last name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-6 text-gray-100"
                >
                  Last Name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border-b border-orange-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-orange-600 focus:outline-none"
                />

                {/* error message */}
                {validationErrors?.lastName && (
                  <p className="mt-1 text-sm font-medium text-red-500">
                    {validationErrors?.lastName}
                  </p>
                )}
              </div>
            </div>
            {/* email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-100"
              >
                Email address
              </label>
              <div className="">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-orange-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-orange-600 focus:outline-none"
                />

                {/* error message */}
                {validationErrors?.email && (
                  <p className="mt-1 text-sm font-medium text-red-500">
                    {validationErrors?.email}
                  </p>
                )}
              </div>
            </div>
            {/* phone number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium leading-6 text-gray-100"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                autoComplete="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={12}
                className="w-full border-b border-orange-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-orange-600 focus:outline-none"
              />

              {/* error message */}
              {validationErrors?.phoneNumber && (
                <p className="mt-1 text-sm font-medium text-red-500">
                  {validationErrors?.phoneNumber}
                </p>
              )}
            </div>
            {/* account type */}
            <div>
              <p className="mb-2 block text-sm font-medium leading-6 text-gray-100">
                Account Type
              </p>
              <div className="flex w-full gap-x-3">
                <label className="w-full items-center">
                  <input
                    type="radio"
                    name="role"
                    value="CLIENT"
                    checked={formData.role === "CLIENT"}
                    onChange={handleChange}
                    className="peer sr-only w-0"
                  />
                  <div className="group flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-md bg-gray-700 px-4 py-3 text-sm font-medium text-white peer-checked:bg-orange-500">
                    <FaCheckCircle
                      className={`h-5 w-5 ${
                        formData.role === "CLIENT" ? "block" : "hidden"
                      }`}
                    />
                    Client
                  </div>
                </label>
                <label className="w-full items-center">
                  <input
                    type="radio"
                    name="role"
                    value="COACH"
                    checked={formData.role === "COACH"}
                    onChange={handleChange}
                    className="peer sr-only w-0"
                  />
                  <div className="flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-md bg-gray-700 px-4 py-3 text-sm font-medium text-white peer-checked:bg-orange-500">
                    <FaCheckCircle
                      className={`h-5 w-5 ${
                        formData.role !== "CLIENT" ? "block" : "hidden"
                      }`}
                    />
                    Coach
                  </div>
                </label>
              </div>
              {/* error message */}
              {validationErrors?.role && (
                <p className="mt-1 text-sm font-medium text-red-500">
                  {validationErrors?.role}
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b border-orange-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-orange-600 focus:outline-none"
              />

              {/* error message */}
              {validationErrors?.password && (
                <p className="mt-1 text-sm font-medium text-red-500">
                  {validationErrors?.password}
                </p>
              )}
            </div>
            {/* confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-100"
              >
                Retype Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="current-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-b border-orange-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-orange-600 focus:outline-none"
              />

              {/* error message */}
              {validationErrors?.confirmPassword && (
                <p className="mt-1 text-sm font-medium text-red-500">
                  {validationErrors?.confirmPassword}
                </p>
              )}
            </div>

            {/* submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading && (
                  <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
                )}
                Sign up
              </button>
              {errorMessage && (
                <p className="mt-3 text-center text-sm font-medium text-red-500">
                  {errorMessage}
                </p>
              )}
            </div>
          </form>
          <div className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-orange-400 hover:text-orange-600"
            >
              Sign in now!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
