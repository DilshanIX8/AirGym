/* eslint-disable react/prop-types */
import axios from "axios";
import { useDispatch } from "react-redux";
import { setRoleValue } from "../../state/user-slice";
import { errorToast, successToast } from "../../utils/toastify";
import { PiSpinnerBold } from "react-icons/pi";
import { useState } from "react";

const CoachSubmissionConfirmation = ({ setIsReSubmit }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async () => {
    setLoading(true);
    await axios
      .post("/coach/finish-profile")
      .then(({ data }) => {
        dispatch(setRoleValue(data.coach));
        setIsReSubmit && setIsReSubmit(false);
        successToast("Profile submitted successfully.");
      })
      .catch((e) => {
        console.log(e);
        errorToast("An error occurred. Please try again.");
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-y-4">
      <h2 className="text-2xl font-bold">Profile Completion</h2>
      <p className="text-center">
        Your profile is ready to submit. After submit We will notify you once
        the verification process is complete.
      </p>
      <button
        type="submit"
        disabled={loading}
        onClick={onSubmit}
        className="flex w-full max-w-72 items-center justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600"
      >
        {loading && (
          <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
        )}
        Confirm Submission
      </button>
    </div>
  );
};

export default CoachSubmissionConfirmation;
