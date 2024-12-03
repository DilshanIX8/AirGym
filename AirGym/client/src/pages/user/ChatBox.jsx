import { useSelector } from "react-redux";
import MessageContainer from "../../components/chat/messages/MessageContainer";
import Sidebar from "../../components/chat/sidebar/Sidebar";
import useListenMessages from "../../hooks/useListenMessages";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiSpinnerBold } from "react-icons/pi";

const ChatBox = () => {
  const { role, user } = useSelector((state) => state.user);
  const [isProgress, setIsProgress] = useState(true);
  const navigate = useNavigate();

  // check if coach is verified
  // if coach is not verified, redirect to coach page
  useEffect(() => {
    if (role?.coachVerified === "VERIFIED" || user?.role === "CLIENT") {
      setIsProgress(false);
    } else {
      navigate("/coach");
    }
  }, [navigate, role, user?.role]);

  useListenMessages();

  // if isProgress is true, show loading spinner
  if (isProgress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <PiSpinnerBold className="mr-1 h-14 w-14 animate-spin font-bold text-orange-400" />
      </div>
    );
  }
  return (
    <div className="flex h-screen w-full justify-center bg-gray-800 2xl:py-4">
      <div className="flex w-full max-w-screen-2xl bg-slate-950 2xl:rounded-md 2xl:border 2xl:border-slate-700">
        <Sidebar />
        <MessageContainer />
      </div>
    </div>
  );
};

export default ChatBox;
