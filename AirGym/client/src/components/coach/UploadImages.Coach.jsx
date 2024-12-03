/* eslint-disable react/prop-types */
import axios from "axios";
import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { transferZodErrors } from "../../utils/transfer-zod-errors";
import { errorToast, successToast } from "../../utils/toastify";
import { PiSpinnerBold } from "react-icons/pi";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { IoCloudUpload } from "react-icons/io5";

const CouchUploadImages = ({ handleNext }) => {
  const webcamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [imageData, setImageData] = useState({
    IdFrontImage: null,
    IdBackImage: null,
    cameraImage: null,
    certificate: [],
  });

  const submitImageDetails = async (e) => {
    e.preventDefault();
    // reset error messages
    setErrorMessage("");
    setValidationErrors({});

    setLoading(true);

    if (
      imageData.IdFrontImage === null ||
      imageData.IdBackImage === null ||
      imageData.cameraImage === null ||
      imageData.certificate.length === 0
    ) {
      errorToast("Please upload all images");
      return setLoading(false);
    }

    if (imageData.certificate.length > 5) {
      errorToast("You can upload up to 5 certificates only");
      return setLoading(false);
    }

    const blob = await fetch(imageData.cameraImage).then((res) => res.blob());
    const cameraImage = new File([blob], "camera.jpg", {
      type: "image/jpeg",
    });
    const formData = new FormData();
    formData.append("IdFrontImage", imageData.IdFrontImage);
    formData.append("IdBackImage", imageData.IdBackImage);
    formData.append("cameraImage", cameraImage);
    imageData.certificate.forEach((certificate) => {
      formData.append("certificate", certificate);
    });

    axios
      .post("/coach/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        // clear form data
        setImageData({
          IdFrontImage: null,
          IdBackImage: null,
          cameraImage: null,
          certificate: [],
        });
        if (handleNext !== undefined && handleNext !== null) {
          handleNext();
        } else {
          successToast("Images saved successfully");
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
        Upload Images
      </h1>
      <form className="space-y-6" onSubmit={submitImageDetails}>
        {/* Front photo upload input */}
        <div>
          <Label htmlFor="IdFrontImage" className="mb-2">
            ID Front Side
          </Label>

          <Label className="mb-2">
            <Input
              id="IdFrontImage"
              name="IdFrontImage"
              type="file"
              accept="image/*"
              className="peer sr-only w-0"
              onChange={(e) =>
                setImageData({ ...imageData, IdFrontImage: e.target.files[0] })
              }
            />
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-orange-400 py-8">
              <IoCloudUpload className="h-16 w-16 text-orange-400 opacity-30" />

              <p className="text-xs font-medium text-orange-300">
                {imageData.IdFrontImage
                  ? imageData.IdFrontImage.name
                  : "Upload an image"}
              </p>
            </div>
          </Label>

          {/* error message */}
          {validationErrors?.IdFrontImage && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.IdFrontImage}
            </p>
          )}
        </div>

        {/* Back photo upload input */}
        <div>
          <Label htmlFor="IdBackImage" className="mb-2">
            ID Back Side
          </Label>

          <Label className="mb-2">
            <Input
              id="IdBackImage"
              name="IdBackImage"
              type="file"
              accept="image/*"
              className="peer sr-only w-0"
              onChange={(e) =>
                setImageData({ ...imageData, IdBackImage: e.target.files[0] })
              }
            />
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-orange-400 py-8">
              <IoCloudUpload className="h-16 w-16 text-orange-400 opacity-30" />

              <p className="text-xs font-medium text-orange-300">
                {imageData.IdBackImage
                  ? imageData.IdBackImage.name
                  : "Upload an image"}
              </p>
            </div>
          </Label>

          {/* error message */}
          {validationErrors?.IdBackImage && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.IdBackImage}
            </p>
          )}
        </div>

        {/* certificate */}
        <div>
          <Label htmlFor="certificate" className="mb-2">
            Certificates / Resume
          </Label>

          <Label className="mb-2">
            <Input
              id="certificate"
              name="certificate"
              type="file"
              accept="image/*,.pdf"
              multiple
              max="5"
              className="peer sr-only w-0"
              onChange={(e) => {
                // select multiple files
                const files = Array.from(e.target.files);
                setImageData({ ...imageData, certificate: files });
              }}
            />
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-orange-400 py-8">
              <IoCloudUpload className="h-16 w-16 text-orange-400 opacity-30" />

              <p className="text-xs font-medium text-orange-300">
                {imageData?.certificate?.length > 0
                  ? `${imageData.certificate.length} files selected`
                  : "Upload an images or pdf"}
              </p>
            </div>
          </Label>

          <p className="mt-1 text-xs">
            You can upload up to 5 certificates or documents. Accept formats are
            jpg, jpeg, png and pdf.
          </p>

          {/* error message */}
          {validationErrors?.certificate && (
            <p className="mt-1 text-sm font-medium text-red-500">
              {validationErrors?.certificate}
            </p>
          )}
        </div>

        {/* User photo capture */}
        <div>
          <Label htmlFor="IdBackImage" className="mb-2">
            Capture a clear photo of your face.
          </Label>

          <div className="flex flex-col items-center justify-center gap-y-6">
            {isCapturing && (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="min- w-full rounded-md bg-slate-700"
              />
            )}

            {imageData.cameraImage && !isCapturing && (
              <img
                src={imageData.cameraImage}
                alt="user"
                className="w-full rounded-md object-cover"
              />
            )}

            <div className="flex w-full flex-col justify-center gap-x-4 gap-y-2 sm:flex-row">
              {/* Capture photo button */}
              {!isCapturing && (
                <button
                  type="button"
                  onClick={() => setIsCapturing(true)}
                  className="mt-2 flex w-full min-w-40 items-center justify-center rounded-md bg-slate-500 px-3 py-1.5 text-sm font-medium leading-6 text-white shadow-sm hover:bg-slate-600 sm:max-w-72"
                >
                  Capture Photo
                </button>
              )}

              {isCapturing && (
                <button
                  type="button"
                  onClick={() => setIsCapturing(false)}
                  className="flex w-full min-w-40 items-center justify-center rounded-md bg-slate-500 px-3 py-1.5 text-sm font-medium leading-6 text-white shadow-sm hover:bg-slate-600 sm:max-w-72"
                >
                  Stop Capture
                </button>
              )}

              {isCapturing && (
                <button
                  type="button"
                  onClick={() => {
                    const imageSrc = webcamRef.current.getScreenshot();
                    setImageData({ ...imageData, cameraImage: imageSrc });
                    setIsCapturing(false);
                  }}
                  className="flex w-full min-w-40 items-center justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium leading-6 text-white shadow-sm hover:bg-green-700 sm:max-w-72"
                >
                  Save Photo
                </button>
              )}
            </div>

            {/* error message */}
            {validationErrors?.cameraImage && (
              <p className="mt-1 text-sm font-medium text-red-500">
                {validationErrors?.cameraImage}
              </p>
            )}
          </div>
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

export default CouchUploadImages;
