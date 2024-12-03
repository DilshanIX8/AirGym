/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeedCard from "../components/cards/FeedCard";
import BookingModal from "../components/BookingModal"; // Import your booking modal component here
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import NotFound from "./NotFound";
import { BiSolidError } from "react-icons/bi";
import { FaStar } from "react-icons/fa6";
import { BsInfoCircleFill } from "react-icons/bs";
import { IoChatbox } from "react-icons/io5";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Label } from "recharts";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { errorToast } from "../utils/toastify";

const PublicProfile = () => {
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    coach: null,
    user: null,
    posts: [],
    availableSlots: [],
  });
  const [open, setIsOpen] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false); // State to control modal visibility
  const { username } = useParams();
  const { user } = useSelector((state) => state.user);

  const loadProfile = useCallback(async () => {
    if (!username) return setIsNotFound(true);
    setFetching(true);
    await axios
      .get("/public/user/" + username)
      .then((res) => {
        setProfile({
          user: res.data.user,
          posts: res.data?.posts || [],
          coach: res.data?.coach || null,
          availableSlots: res.data?.availableSlots || [],
        });
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setIsNotFound(true);
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, [username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleBookAppointment = () => {
    setShowBookingModal(true); // Show modal when booking button is clicked
  };

  // show not found page if user not found
  if (isNotFound) return <NotFound />;

  return (
    <div className="flex min-h-screen flex-col items-center">
      {/* navbar */}
      <Navbar />
      {/* start conversation popup */}
      <StartConversation
        setIsOpen={setIsOpen}
        open={open}
        username={username}
      />

      {/* if fetching */}
      {fetching && <p className="max-w-3xl pt-28 text-white">Loading...</p>}
      {/* if error */}
      {error && !fetching && (
        <p className="flex w-full max-w-3xl items-center justify-center gap-x-2 rounded-md bg-red-500/80 p-2 pt-28 text-white">
          <BiSolidError className="h-6 w-6" /> {error}
        </p>
      )}

      {/* if details found */}
      {!isNotFound && !fetching && !error && (
        <div className="w-full max-w-4xl pt-28">
          {/* user profile details */}
          <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 border-b border-orange-400 pb-5 sm:flex-row sm:items-start">
            {/* profile image */}
            <div className="items-center justify-center">
              <img
                src={
                  import.meta.env.VITE_APP_IMAGE_URL +
                  profile?.user?.profileImage
                }
                alt={profile?.user?.firstName}
                className="h-auto w-60 rounded-full"
              />
            </div>
            {/* user details */}
            <div className="flex w-full flex-col justify-start">
              <div className="flex items-center gap-x-3">
                {/* name */}
                <h2 className="truncate text-center text-2xl font-medium text-gray-100 sm:text-start">
                  {profile?.user?.firstName} {profile?.user?.lastName}
                  <span className="ms-2 text-sm font-medium capitalize text-orange-400">
                    ({profile?.user?.role.replaceAll("_", " ").toLowerCase()})
                  </span>
                </h2>
                {/* chat icon : its shows if profile owner is coach and profile viewer is client */}
                {user?.role === "CLIENT" && profile?.user?.role === "COACH" && (
                  <IoChatbox
                    className="h-5 w-5 cursor-pointer text-orange-400"
                    onClick={() => setIsOpen(true)}
                  />
                )}{" "}
              </div>
              {/* phone , email , and other details and booking button*/}
              <div className="mt-2 w-full text-sm">
                <p className="text-gray-300">Email: {profile?.user?.email}</p>
                <p className="text-gray-300">
                  Phone Number: {profile?.user?.phoneNumber}
                </p>
                {/* coach details */}
                {profile?.coach && profile?.user?.role === "COACH" && (
                  <div className="mt-5 w-full border-t border-orange-400 pt-3 text-gray-300">
                    <h2 className="text-base font-medium text-orange-400">
                      Coach Profile
                    </h2>
                    {/* ratings */}
                    <div className="flex items-center gap-2 py-2">
                      Ratings:
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`${
                            i + 1 <= Math.floor(profile?.coach?.ratings)
                              ? "text-amber-400"
                              : "text-gray-300"
                          }`}
                        >
                          <FaStar />
                        </span>
                      ))}
                      ({profile?.coach?.ratings})
                    </div>
                    <p className="text-gray-300">
                      Birthday:{" "}
                      {new Date(profile?.coach?.birthday).toDateString()}
                    </p>
                    <p className="capitalize text-gray-300">
                      Experience:{" "}
                      {profile?.coach?.experience
                        .replaceAll("_", " ")
                        .toLowerCase()}
                    </p>
                    <p className="text-gray-300">
                      Description: {profile?.coach?.description}
                    </p>
                    <p className="text-gray-300">
                      One Session Fee: LKR {profile?.coach?.oneSessionFee}
                    </p>
                  </div>
                )}

                {/* Show the button only if the user is a client */}
                {user?.role === "CLIENT" && profile?.user?.role === "COACH" && (
                  <div className="mt-6 flex justify-start">
                    <button
                      onClick={handleBookAppointment} // Open modal on click
                      className="rounded bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600"
                    >
                      Book Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* posts */}
          <div className="mx-4 flex flex-col gap-8 py-8">
            {/* title */}
            <h2 className="text-2xl font-medium">
              Posts{" "}
              <span className="text-base"> ({profile?.posts?.length})</span>
            </h2>
            {/* if no post found */}
            {profile?.posts?.length === 0 && (
              <div className="flex justify-center">
                <p className="flex w-full max-w-3xl items-center justify-center gap-x-2 rounded-md p-2 text-white">
                  <BsInfoCircleFill className="h-4 w-4" />
                  No post found
                </p>
              </div>
            )}

            {profile?.posts?.map((data, index) => (
              <FeedCard
                key={index}
                coverImage={import.meta.env.VITE_APP_IMAGE_URL + data.image}
                profilePicture={data.author.profileImage}
                title={data.title}
                ProfileUrl={"/user/" + data.author.username}
                date={new Date(data.createdAt).toDateString()}
                name={data.author.firstName + " " + data.author.lastName}
                content={data.content}
                likes={data._count.likes}
                id={data.id}
                comments={data.comments}
                isLiked={data.likes.length > 0 ? true : false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          onClose={() => setShowBookingModal(false)}
          availableSlots={profile?.availableSlots}
          startSlot={profile.coach.startTimeSlot}
          endSlot={profile.coach.endTimeSlot}
        />
      )}

      {/* flex grow */}
      <div className="flex flex-grow flex-col" />

      {/* footer */}
      <Footer />
    </div>
  );
};

const StartConversation = ({ setIsOpen, open, username }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .post(`/common/chat/send/${username}`, {
        message,
      })
      .then(() => {
        setIsOpen(false);
        navigate("/client/chat");
      })
      .catch(() => {
        errorToast("Failed to send message");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AlertDialog open={open} setIsOpen={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Start a conversation with the coach
          </AlertDialogTitle>
          <AlertDialogDescription>
            You can start a conversation with the coach by sending a message
          </AlertDialogDescription>
          {/* message */}
          <div className="mt-3 grid gap-4">
            <Label
              htmlFor="message"
              className="flex items-center justify-between"
            >
              Message
              {/* letter count */}
              <span className="text-sm text-gray-300">
                {message.length}/500
              </span>
            </Label>
            <Textarea
              id="message"
              className=""
              value={message}
              maxLength={500}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Type your message here..."
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={() => setIsOpen(false)}
            className="!bg-gray-800 text-gray-400 hover:text-gray-500"
          >
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublicProfile;
