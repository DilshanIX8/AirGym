/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transferZodErrors } from "../../utils/transfer-zod-errors";
import { successToast } from "../../utils/toastify";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Calendar } from "../ui/calendar";
import { PiSpinnerBold } from "react-icons/pi";
import { setRoleValue, setUserValue } from "../../state/user-slice";

const GeneralDetails = ({ handleNext }) => {
  const { user, role } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    // 18 years before today
    birthday:
      role?.birthday ||
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    address: role?.address || "",
    idNumber: role?.idNumber || "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const submitGeneralDetails = async (e) => {
    e.preventDefault();
    // reset error messages
    setErrorMessage("");
    setValidationErrors({});

    setLoading(true);

    axios
      .post("/coach/profile", userData)
      .then(({ data }) => {
        dispatch(setUserValue(data?.user?.user));
        if (data?.user?.user?.role === "COACH") {
          dispatch(setRoleValue(data?.user?.coach));
        }
        if (handleNext !== undefined && handleNext !== null) {
          handleNext();
        } else {
          successToast("General details saved successfully");
        }
      })
      .catch((err) => {
        if (err.response.data.error) setErrorMessage(err.response.data.error);
        else if (err.response.data.errors) {
          setValidationErrors(
            transferZodErrors(err.response.data.errors).error,
          );
        } else setErrorMessage("An error occurred. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex h-full w-full max-w-2xl flex-col justify-center">
      <h1 className="pb-5 text-center text-base font-semibold text-orange-100 sm:text-xl lg:text-2xl xl:pb-8">
        General Details
      </h1>
      <form className="space-y-6" onSubmit={submitGeneralDetails}>
        {/* firstName */}
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
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.firstName && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.firstName}
            </p>
          )}
        </div>

        {/* lastName */}
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
            onChange={handleChange}
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
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.email && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.email}
            </p>
          )}
        </div>

        {/* phoneNumber */}
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
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.phoneNumber && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.phoneNumber}
            </p>
          )}
        </div>

        {/* birthday */}
        <div className="flex flex-col">
          <Label htmlFor="birthday" className="text-orange-500">
            Birthday
          </Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "mt-2 flex h-10 w-full items-center justify-between border-orange-400 px-3 text-left font-normal !ring-0 hover:bg-transparent focus:border-orange-500",
                  !userData.birthday && "text-muted-foreground",
                )}
              >
                {userData.birthday ? (
                  format(userData.birthday, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                maxDate={new Date()}
                defaultMonth={new Date(userData.birthday)}
                selected={new Date(userData.birthday)}
                onSelect={(date) =>
                  setUserData({ ...userData, birthday: date })
                }
                captionLayout="dropdown"
                fromYear={1950}
                toYear={2006}
              />
            </PopoverContent>
          </Popover>

          {/* error message */}
          {validationErrors?.birthday && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.birthday}
            </p>
          )}
        </div>

        {/* address */}
        <div>
          <Label htmlFor="address" className="text-orange-500">
            Address
          </Label>

          <Input
            id="address"
            name="address"
            type="text"
            autoComplete="address"
            required
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.address}
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.address && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.address}
            </p>
          )}
        </div>

        {/* idNumber */}
        <div>
          <Label htmlFor="idNumber" className="text-orange-500">
            ID Number
          </Label>

          <Input
            id="idNumber"
            name="idNumber"
            type="text"
            autoComplete="idNumber"
            required
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.idNumber}
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.idNumber && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.idNumber}
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

export default GeneralDetails;
