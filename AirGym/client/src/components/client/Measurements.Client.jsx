import axios from "axios";
import { useState } from "react";
import { transferZodErrors } from "../../utils/transfer-zod-errors";
import { errorToast, successToast } from "../../utils/toastify";
import { PiSpinnerBold } from "react-icons/pi";

const measurements = [
  "biceps",
  "calf",
  "chest",
  "forearm",
  "height",
  "hip",
  "neck",
  "shoulders",
  "weight",
  "waist",
  "thigh",
];

const ClientMeasurements = () => {
  const [userData, setUserData] = useState({
    biceps: "",
    calf: "",
    chest: "",
    forearm: "",
    height: "",
    hip: "",
    neck: "",
    shoulders: "",
    weight: "",
    waist: "",
    thigh: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const addFigureData = async () => {
    // clear errors
    setValidationErrors({});

    setLoading(true);

    await axios
      .post("/client/figure", userData)
      .then(() => {
        successToast("Figure data added successfully");
        // reset form
        setUserData({
          biceps: "",
          calf: "",
          chest: "",
          forearm: "",
          height: "",
          hip: "",
          neck: "",
          shoulders: "",
          weight: "",
          waist: "",
          thigh: "",
        });
      })
      .catch((err) => {
        if (err.response.data.error) errorToast(err.response.data.error);
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
    <div className="w-full xl:container">
      <h1 className="pb-5 text-center text-base font-semibold text-orange-100 sm:text-xl lg:text-2xl xl:pb-8">
        Add Your Measurements - centimeters(cm) / kilogram(kg)
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {/* values */}
        {measurements.map((measurement, index) => {
          return (
            <div
              key={index}
              className="flex w-full max-w-lg flex-col gap-x-3 rounded-md border border-slate-700 bg-slate-900 p-4 shadow-xl shadow-slate-700/10 drop-shadow-xl sm:flex-row"
            >
              {/* Image */}
              <div className="flex w-full transform justify-center rounded-xl drop-shadow-md duration-300 sm:w-fit">
                <img
                  src={`/images/measurements/${measurement}.png`}
                  alt="biceps"
                  className="h-40 w-80 rounded-md object-cover"
                />
              </div>
              {/* text field */}
              <div className="w-full py-2 sm:col-span-4">
                <label
                  htmlFor={measurement}
                  className="block text-base font-medium capitalize leading-6 text-orange-400 md:text-lg"
                >
                  {measurement}
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name={measurement}
                    id={measurement}
                    className="w-full appearance-none border-0 border-b border-orange-400 bg-transparent px-0 py-2.5 text-sm text-gray-100 focus:border-orange-600 focus:outline-none focus:ring-0"
                    placeholder={"Enter values"}
                    value={userData[measurement]}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        [measurement]: e.target.value,
                      })
                    }
                  />
                  {/* error message */}
                  {validationErrors[measurement] && (
                    <p className="mt-1 text-sm font-medium text-red-500">
                      {validationErrors[measurement]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-col items-center justify-center">
        <button
          onClick={addFigureData}
          className="inline-flex w-60 items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          {loading && (
            <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
          )}
          Save
        </button>
      </div>
    </div>
  );
};

export default ClientMeasurements;
