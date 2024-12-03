/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { errorToast, successToast } from "../utils/toastify";

const BookingModal = ({ onClose, availableSlots, startSlot, endSlot }) => {
  const [formData, setFormData] = useState({
    name: "",
    sessionFee: "",
    startTimeSlot: "",
    endTimeSlot: "",
  });
  // get username from url params
  const { username } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openPayhere = async (res) => {
    const payment_object = {
      sandbox: true,
      preapprove: true,
      merchant_id: res?.merchant_id,
      return_url: res?.return_url,
      cancel_url: res?.cancel_url,
      notify_url: res?.notify_url,
      order_id: res?.order_id,
      items: res?.items,
      amount: res?.amount,
      currency: res?.currency,
      hash: res?.hash,
      first_name: res?.first_name,
      last_name: res?.last_name,
      email: res?.email,
      phone: res?.phone,
      address: res?.address,
      city: res?.city,
      country: res?.country,
    };

    window.payhere.startPayment(payment_object);

    window.payhere.onCompleted = async function onCompleted() {
      await axios
        .post("/client/session/payment", {
          sessionId: res?.order_id,
          paymentId: res?.order_id,
          payment: res?.amount,
        })
        .then((res) => {
          console.log(res.data);
          successToast("Payment completed successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    };

    window.payhere.onDismissed = function onDismissed() {
      errorToast("Payment dismissed");
    };

    window.payhere.onError = function onError() {
      errorToast("Payment error");
    };
  };

  const submitForm = async (e) => {
    e.preventDefault();
    // return if any field is empty
    if (!formData?.timeSlot || !username) return;

    // make api call to book session
    await axios
      .post("/client/session", { timeSlot: formData?.timeSlot, username })
      .then(async (res) => {
        console.log(res.data);
        onClose();
        await openPayhere(res.data?.payment);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkIsAvailable = (slot) => {
    return !availableSlots.includes(slot);
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-black/30 px-2 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-orange-400/40 bg-slate-900 p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-medium">Book a Session</h2>
        {/* text for session date (tomorrow) */}
        <p className="">
          You are booking a session for tomorrow.(
          {new Date(Date.now() + 86400000).toDateString()}) Please select a time
          slot.
        </p>
        <form onSubmit={submitForm}>
          {/* Time Slot */}
          <div className="py-2">
            <p className="block text-sm font-medium leading-6 text-orange-400">
              Time Slot
            </p>
            <div className="mb-3 mt-2 grid grid-cols-2 gap-4">
              {Array.from({ length: endSlot - startSlot + 1 }, (_, i) => (
                <label key={i} className="flex items-center">
                  <input
                    name="timeSlot"
                    value={startSlot + i}
                    onChange={handleChange}
                    type="radio"
                    className="peer sr-only w-0"
                    disabled={checkIsAvailable(startSlot + i)}
                  />
                  <div className="w-full cursor-pointer rounded bg-slate-700 py-2 text-center peer-checked:bg-orange-500 peer-disabled:cursor-not-allowed peer-disabled:bg-slate-800">
                    {(startSlot + i).toString().padStart(2, "0")}.00 -
                    {(startSlot + i + 1).toString().padStart(2, "0")}.00
                  </div>
                </label>
              ))}
            </div>
          </div>
          {/* buttons */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="mr-2 inline-flex w-28 justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none"
            >
              Book Now
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-28 justify-center rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-gray-100 shadow-sm hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
