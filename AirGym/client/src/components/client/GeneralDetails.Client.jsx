import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transferZodErrors } from "../../utils/transfer-zod-errors";
import { errorToast, successToast } from "../../utils/toastify";
import { PiSpinnerBold } from "react-icons/pi";
import { setUserValue } from "../../state/user-slice";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const ClientGeneralDetails = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const submitGeneralDetails = async (e) => {
    e.preventDefault();
    // clear errors
    setErrorMessage("");
    setValidationErrors({});

    setLoading(true);

    axios
      .post("/common/profile", userData)
      .then(({ data }) => {
        successToast("Profile updated successfully");
        dispatch(setUserValue(data?.data?.user));
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
    <div className="flex w-full flex-col items-center justify-center xl:container">
      <h1 className="pb-5 text-center text-base font-semibold text-orange-100 sm:text-xl lg:text-2xl xl:pb-8">
        My Details
      </h1>
      <form
        className="w-full max-w-2xl space-y-6"
        onSubmit={submitGeneralDetails}
      >
        {/* first name */}
        <div>
          <Label htmlFor="firstName" className="text-orange-500">
            First Name
          </Label>

          <Input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="firstName"
            required
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.firstName}
            onChange={(e) =>
              setUserData({ ...userData, firstName: e.target.value })
            }
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
          <Label htmlFor="lastName" className="text-orange-500">
            Last Name
          </Label>

          <Input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="lastName"
            required
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.lastName}
            onChange={(e) =>
              setUserData({ ...userData, lastName: e.target.value })
            }
          />

          {/* error message */}
          {validationErrors?.lastName && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.lastName}
            </p>
          )}
        </div>

        {/* email */}
        <div>
          <Label htmlFor="email" className="text-orange-500">
            Email
          </Label>

          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />

          {/* error message */}
          {validationErrors?.email && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.email}
            </p>
          )}
        </div>

        {/* phone */}
        <div>
          <Label htmlFor="phoneNumber" className="text-orange-500">
            Phone Number
          </Label>

          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            autoComplete="phoneNumber"
            required
            maxLength="12"
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.phoneNumber}
            onChange={(e) => {
              setUserData({ ...userData, phoneNumber: e.target.value });
            }}
          />

          {/* error message */}
          {validationErrors?.phoneNumber && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.phoneNumber}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600"
          >
            {loading && (
              <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
            )}
            Save
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
  );
};

export default ClientGeneralDetails;
