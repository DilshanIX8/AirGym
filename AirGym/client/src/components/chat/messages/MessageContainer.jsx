import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConversation } from "../../../state/chat-slice";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const MessageContainer = () => {
  const { selectedConversation, sender } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    // Cleanup function
    return () => dispatch(setSelectedConversation(null));
  }, [dispatch]);
  return (
    <div
      className={`xl:w[70%] w-full flex-col md:w-[60%] ${selectedConversation ? "flex" : "hidden md:flex"}`}
    >
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="mb-2 flex items-center gap-x-2 bg-slate-500 px-4 py-3 text-sm font-medium">
            <IoMdArrowRoundBack
              className="h-5 w-5 cursor-pointer md:hidden"
              onClick={() => dispatch(setSelectedConversation(null))}
            />
            <p className="me-2">
              To:{" "}
              <Link
                to={`/user/${sender?.username}`}
                className="text-gray-100 hover:underline"
              >
                {sender?.firstName} {sender?.lastName}
              </Link>
            </p>
          </div>
          <Messages />
          {/* flex grow div */}
          <div className="flex-grow" />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="md:text-x1 flex flex-col items-center gap-2 px-4 text-center font-medium text-gray-200 sm:text-lg">
        <p>
          Welcome 👋 {user?.firstName} {user?.lastName} 💭
        </p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-center text-3xl md:text-6xl" />
      </div>
    </div>
  );
};
