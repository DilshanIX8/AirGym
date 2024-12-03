/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { RiMenu2Fill } from "react-icons/ri";
import { resetUserValue, setUserValue } from "../../state/user-slice";
import { CgLogOut } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { FaCircle, FaPen } from "react-icons/fa";
import { errorToast, successToast } from "../../utils/toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { MdFeedback } from "react-icons/md";

const Sidebar = ({ urls, isAdmin = false }) => {
  const { user } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [unreadIssues, setUnreadIssues] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const sidebarRef = useRef();

  const logout = () => {
    axios.post("/common/logout").then(() => {
      dispatch(resetUserValue());
      navigate("/login");
    });
  };

  const updateProfileImage = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profileImage", file);
    axios
      .post("/common/image", formData)
      .then(({ data }) => {
        successToast("Profile image updated successfully");
        dispatch(setUserValue(data?.user?.user));
      })
      .catch(() => {
        errorToast("Failed to update profile image");
      });
  };

  // get user un-read issues count
  useEffect(() => {
    axios
      .get("/common/issues/unread")
      .then(({ data }) => {
        if (data.unread > 0) {
          setUnreadIssues(data.unread);
        }
      })
      .catch(() => {
        errorToast("Failed to get unread issues");
      });
  }, []);

  // use effect for sidebar hidden when user click the outside of the side bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    // Add click event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  return (
    <div className="">
      <div className="absolute flex w-full justify-between bg-slate-950 px-2 lg:justify-end">
        {/* button for toggle */}
        <button
          data-drawer-target="default-sidebar"
          data-drawer-toggle="default-sidebar"
          aria-controls="default-sidebar"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          type="button"
          className="inline-flex items-center rounded-lg p-2 text-sm hover:bg-slate-800 focus:outline-none lg:hidden"
        >
          <RiMenu2Fill className="h-7 w-7 text-orange-400" />
        </button>
        {/* buttons for notifications */}
        {!isAdmin && (
          <div className="me-3 mt-2 flex items-center gap-x-3">
            {/* feedback */}
            <MdFeedback
              onClick={() => setIsFeedbackOpen(true)}
              className="h-6 w-6 cursor-pointer text-orange-400"
            />
            {/* notifications */}
            <Link
              to={`${user?.role === "CLIENT" ? "/client" : "/coach"}/notifications`}
              className="relative"
            >
              <IoIosNotifications className="h-7 w-7 text-white" />
              {/* if there are unread issues */}
              {unreadIssues > 0 && (
                <FaCircle className="absolute bottom-3 end-0 h-3 w-3 text-sky-500" />
              )}
            </Link>
          </div>
        )}
      </div>

      {/* submit issue pop up */}
      <SubmitIssue isOpen={isIssueOpen} setIsOpen={setIsIssueOpen} />
      {/* submit feedback pop up */}
      <SubmitFeedback isOpen={isFeedbackOpen} setIsOpen={setIsFeedbackOpen} />

      {/* sidebar */}
      <aside
        ref={sidebarRef}
        id="default-sidebar"
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 z-40 h-screen w-72 transition-transform lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col overflow-y-auto bg-slate-800 px-3 py-4">
          {/* close icon for small devices */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="self-end lg:hidden"
          >
            <IoCloseSharp className="h-5 w-5" />
          </button>
          {/* profile image and name */}
          <div className="mb-4 mt-3 flex flex-col items-center border-b border-orange-400 pb-4">
            {/* if image url is null */}
            {user?.profileImage == null && (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-orange-500 text-7xl">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </div>
            )}
            {/* if image url is not null */}
            {user?.profileImage != null && (
              <div className="relative">
                <img
                  src={
                    import.meta.env.VITE_APP_IMAGE_URL +
                    user?.profileImage +
                    `?${new Date().getSeconds()}`
                  }
                  alt={user.firstName.charAt(0) + user.lastName.charAt(0)}
                  className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-orange-500 bg-orange-500 text-7xl"
                />
                <label htmlFor="profile-image">
                  <input
                    type="file"
                    id="profile-image"
                    className="peer sr-only"
                    accept="image/*"
                    onChange={updateProfileImage}
                  />
                  <div className="absolute bottom-1 right-2 h-8 w-8 cursor-pointer rounded-full bg-orange-500 p-2">
                    <FaPen />
                  </div>
                </label>
              </div>
            )}
            {/* name  */}
            <p className="mb-1 mt-3 font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            {/* role */}
            <p className="rounded-full border border-orange-300 bg-orange-600 px-4 py-0.5 text-xs font-medium capitalize">
              {user?.role.toLowerCase()}
            </p>
          </div>
          {/* side links */}
          <ul className="space-y-2 font-medium">
            {urls?.map((url, index) => {
              return (
                <li key={index}>
                  <Link
                    to={url.link}
                    className={`group flex items-center rounded-lg p-2 text-white ${pathname === url.link ? "bg-orange-500 hover:bg-orange-600" : "hover:bg-gray-700"}`}
                  >
                    {url.icon}
                    <span className="ms-2">{url.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* flex grow */}
          <div className="flex flex-grow flex-col" />
          {/* logout */}
          <div className="flex items-center justify-between border-t border-orange-400 px-2 pt-6">
            <button
              onClick={logout}
              className="flex items-center gap-x-2 font-medium hover:text-orange-400"
            >
              <CgLogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
            {/* issues */}
            {!isAdmin && (
              <button
                onClick={() => setIsIssueOpen(true)}
                className="flex items-center gap-x-2 font-medium hover:text-orange-400"
              >
                Issues
                <AiOutlineIssuesClose />
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

const SubmitIssue = ({ isOpen, setIsOpen }) => {
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // id issue is empty
    if (!issue || issue.length < 1) {
      return errorToast("Issue is required");
    }
    setLoading(true);
    await axios
      .post(`/common/issues`, { issue })
      .then(() => {
        successToast("Issue submitted successfully");
        setIsOpen(false);
        setIssue("");
      })
      .catch((err) => {
        if (err?.response?.data.error) errorToast(err.response.data.error);
        else errorToast("Failed to submit issue");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Issue</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Please describe your issue in detail so that we can help you better.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {/* issue */}
          <div className="mt-3 grid gap-4">
            <Label
              htmlFor="issue"
              className="flex items-center justify-between"
            >
              Describe Issue
              {/* letter count */}
              <span className="text-sm text-gray-300">
                {issue?.length || 0}/1000
              </span>
            </Label>
            <Textarea
              id="issue"
              className=""
              value={issue}
              maxLength={1000}
              onChange={(e) => setIssue(e.target.value)}
              rows={8}
              placeholder="Write your issue here"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit Issue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SubmitFeedback = ({ isOpen, setIsOpen }) => {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // id feedback is empty
    if (!feedback || feedback.length < 1) {
      return errorToast("Feedback is required");
    }
    setLoading(true);
    await axios
      .post(`/common/feedback`, { feedback })
      .then(() => {
        successToast("Feedback submitted successfully");
        setIsOpen(false);
        setFeedback("");
      })
      .catch((err) => {
        if (err?.response?.data.error) errorToast(err.response.data.error);
        else errorToast("Failed to submit feedback");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Please describe your feedback in detail so that we can help you
            better.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {/* feedback */}
          <div className="mt-3 grid gap-4">
            <Label
              htmlFor="feedback"
              className="flex items-center justify-between"
            >
              Feedback
              {/* letter count */}
              <span className="text-sm text-gray-300">
                {feedback?.length || 0}/1000
              </span>
            </Label>
            <Textarea
              id="feedback"
              className=""
              value={feedback}
              maxLength={1000}
              onChange={(e) => setFeedback(e.target.value)}
              rows={8}
              placeholder="Write your feedback here"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Sidebar;
