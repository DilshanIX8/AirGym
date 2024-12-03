/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { transferZodErrors } from "../../utils/transfer-zod-errors";
import { useDispatch, useSelector } from "react-redux";
import { successToast } from "../../utils/toastify";
import { setRoleValue, setUserValue } from "../../state/user-slice";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PiSpinnerBold } from "react-icons/pi";

const CoachProfessionalDetails = ({ handleNext }) => {
  const { role } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    description: role?.description || "",
    experience: role?.experience || "",
    oneSessionFee: role?.oneSessionFee || "",
    startTimeSlot: role?.startTimeSlot || 8,
    endTimeSlot: role?.endTimeSlot || 17,
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const submitProfessionalDetails = async (e) => {
    e.preventDefault();
    // reset error messages
    setErrorMessage("");
    setValidationErrors({});

    setLoading(true);

    axios
      .post("/coach/professional", userData)
      .then(({ data }) => {
        dispatch(setUserValue(data?.user?.user));
        if (data?.user?.user?.role === "COACH") {
          dispatch(setRoleValue(data?.user?.coach));
        }
        if (handleNext !== undefined && handleNext !== null) {
          handleNext();
        } else {
          successToast("Professional details saved successfully");
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
        Professional Details
      </h1>
      <form className="space-y-6" onSubmit={submitProfessionalDetails}>
        {/* session fee */}
        <div>
          <Label htmlFor="oneSessionFee" className="text-orange-500">
            Session Fee (LKR)
          </Label>

          <Input
            id="oneSessionFee"
            name="oneSessionFee"
            type="number"
            autoComplete="oneSessionFee"
            required
            className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.oneSessionFee}
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.oneSessionFee && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.oneSessionFee}
            </p>
          )}
        </div>

        {/* description */}
        <div>
          <Label
            htmlFor="description"
            className="flex items-center justify-between text-orange-500"
          >
            Description{" "}
            <span className="text-white">
              {userData.description.length}/500
            </span>
          </Label>

          <Textarea
            id="description"
            name="description"
            autoComplete="description"
            required
            rows={5}
            maxLength={500}
            className="mt-2 border-orange-400 !ring-0 focus:border-orange-500"
            value={userData.description}
            onChange={handleChange}
          />

          {/* error message */}
          {validationErrors?.description && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.description}
            </p>
          )}
        </div>

        {/* experience */}
        <div>
          <Label htmlFor="experience" className="text-orange-500">
            Experience
          </Label>
          <Select
            onValueChange={(value) =>
              setUserData({ ...userData, experience: value })
            }
            value={userData.experience}
          >
            <SelectTrigger className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500">
              <SelectValue placeholder="Select your experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="BELOW_1_YEAR">Below 1 Year</SelectItem>
                <SelectItem value="ONE_TO_THREE_YEARS">1 to 3 Years</SelectItem>
                <SelectItem value="THREE_TO_FIVE_YEARS">
                  3 to 5 Years
                </SelectItem>
                <SelectItem value="ABOVE_FIVE_YEARS">Above 5 Years</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* error message */}
          {validationErrors?.experience && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.experience}
            </p>
          )}
        </div>

        {/* start time slot*/}
        <div>
          <Label htmlFor="startTimeSlot" className="text-orange-500">
            Start Time Slot
          </Label>
          <Select
            onValueChange={(value) =>
              setUserData({ ...userData, startTimeSlot: parseInt(value) })
            }
            value={userData.startTimeSlot}
          >
            <SelectTrigger className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500">
              <SelectValue placeholder="Select your start time slot" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[...Array(24).keys()].map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {`${hour.toString().padStart(2, "0")}:00 - ${(hour + 1)
                      .toString()
                      .padStart(2, "0")}:00`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* error message */}
          {validationErrors?.startTimeSlot && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.startTimeSlot}
            </p>
          )}
        </div>

        {/* end time slot*/}
        <div>
          <Label htmlFor="endTimeSlot" className="text-orange-500">
            End Time Slot
          </Label>
          <Select
            onValueChange={(value) =>
              setUserData({ ...userData, endTimeSlot: parseInt(value) })
            }
            value={userData.endTimeSlot}
          >
            <SelectTrigger className="mt-2 h-10 border-orange-400 !ring-0 focus:border-orange-500">
              <SelectValue placeholder="Select your end time slot" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[...Array(24).keys()].map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {`${hour.toString().padStart(2, "0")}:00 - ${(hour + 1)
                      .toString()
                      .padStart(2, "0")}:00`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* error message */}
          {validationErrors?.endTimeSlot && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.endTimeSlot}
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

export default CoachProfessionalDetails;
