/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { transferZodErrors } from "../../utils/transfer-zod-errors";
import { useDispatch, useSelector } from "react-redux";
import { successToast } from "../../utils/toastify";
import { setRoleValue, setUserValue } from "../../state/user-slice";
import { PiSpinnerBold } from "react-icons/pi";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const CoachPaymentDetails = ({ handleNext }) => {
  const { role } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    accountHolderName: role?.paymentAccount?.accountHolderName || "",
    nameOfBank: role?.paymentAccount?.nameOfBank || "",
    accountNumber: role?.paymentAccount?.accountNumber || "",
    branch: role?.paymentAccount?.branch || "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const submitPaymentDetails = async (e) => {
    e.preventDefault();
    // reset error messages
    setErrorMessage("");
    setValidationErrors({});

    setLoading(true);
    await axios
      .post("/coach/payment", userData)
      .then(({ data }) => {
        dispatch(setUserValue(data?.user?.user));
        if (data?.user?.user?.role === "COACH") {
          dispatch(setRoleValue(data?.user?.coach));
        }
        if (handleNext !== undefined && handleNext !== null) {
          handleNext();
        } else {
          successToast("Payment details saved successfully");
        }
      })
      .catch((err) => {
        if (err.response.data.error) setErrorMessage(err.response.data.error);
        else if (err.response.data.errors)
          setValidationErrors(
            transferZodErrors(err.response.data.errors).error,
          );
        else setErrorMessage("An error occurred. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex h-full w-full max-w-2xl flex-col justify-center">
      <h1 className="pb-5 text-center text-base font-semibold text-orange-100 sm:text-xl lg:text-2xl xl:pb-8">
        Payment Details
      </h1>
      <form className="space-y-6" onSubmit={submitPaymentDetails}>
        {/* account holder name */}
        <div>
          <Label htmlFor="accountHolderName" className="text-orange-500">
            Name of the Bank Account Holder
          </Label>

          <Input
            id="accountHolderName"
            name="accountHolderName"
            type="text"
            autoComplete="accountHolderName"
            required
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.accountHolderName}
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.accountHolderName && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.accountHolderName}
            </p>
          )}
        </div>

        {/* Name of the bank */}
        <div>
          <Label htmlFor="nameOfBank" className="text-orange-500">
            Name of the Bank
          </Label>

          <Input
            id="nameOfBank"
            name="nameOfBank"
            type="text"
            autoComplete="nameOfBank"
            required
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.nameOfBank}
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.nameOfBank && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.nameOfBank}
            </p>
          )}
        </div>

        {/* Account number */}
        <div>
          <Label htmlFor="accountNumber" className="text-orange-500">
            Account Number
          </Label>

          <Input
            id="accountNumber"
            name="accountNumber"
            type="text"
            autoComplete="accountNumber"
            required
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.accountNumber}
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.accountNumber && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.accountNumber}
            </p>
          )}
        </div>

        {/* Bank branch */}
        <div>
          <Label htmlFor="branch" className="text-orange-500">
            Bank Branch
          </Label>

          <Input
            id="branch"
            name="branch"
            type="text"
            autoComplete="branch"
            required
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.branch}
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.branch && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.branch}
            </p>
          )}
        </div>

        {/* submit */}
        <div className="flex flex-col items-end">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full max-w-40 items-center justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600"
          >
            {loading && (
              <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
            )}
            Save Details
          </button>
          {/* error message */}
          {errorMessage && (
            <p className="mt-3 w-full text-center text-sm font-medium text-red-500">
              {errorMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CoachPaymentDetails;
