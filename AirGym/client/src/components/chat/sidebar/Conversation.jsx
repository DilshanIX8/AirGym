/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { useSocketContext } from "../../../context/SocketContext";
import { setSelectedConversation, setSender } from "../../../state/chat-slice";
import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";

const Conversation = ({ conversation }) => {
  const { selectedConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [name, senName] = useState("You");
  const [lastMessage, setLastMessage] = useState({});

  const isSelected = selectedConversation?.id === conversation.id;
  const { onlineUsers } = useSocketContext();

  const sender =
    user?.username === conversation?.receiver?.username
      ? conversation.sender
      : conversation.receiver;
  const isOnline = onlineUsers.includes(sender.username);

  useEffect(() => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    setLastMessage(lastMessage);
    const name =
      user?.username === lastMessage?.sender ? "You" : `${sender.firstName}`;

    senName(name);
  }, [conversation.messages, sender.firstName, user?.username]);

  return (
    <div
      className={`cursor-pointer border-b border-gray-700 py-1 pb-2`}
      onClick={() => {
        dispatch(setSelectedConversation(conversation));
        dispatch(setSender(sender));
      }}
    >
      <div
        className={`flex items-center gap-2 rounded-md p-2 hover:bg-orange-500 ${isSelected ? "bg-orange-500" : ""} `}
      >
        {/* image , last message time and active badge */}
        <div className="relative h-8 w-8 rounded-full">
          <img
            src={import.meta.env.VITE_APP_IMAGE_URL + sender?.profileImage}
            alt="user"
            className="z-0 h-8 w-8 rounded-full"
          />
          {isOnline && (
            <GoDotFill className="absolute -bottom-1.5 -right-1.5 z-[2] h-5 w-5 text-green-500" />
          )}
        </div>

        {/* name and last message */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-3">
            <p className="line-clamp-1 truncate text-sm font-medium text-gray-200">
              {sender?.firstName} {sender?.lastName}
            </p>
            {/*  last message time */}
            <p className="text-[0.7rem] text-gray-200">
              {conversation?.messages?.length > 0
                ? new Date(lastMessage?.createdAt).toLocaleTimeString()
                : ""}
            </p>
          </div>
          {/* last message */}
          <p className="text-xs" aria-label="message">
            {conversation?.messages?.length > 0
              ? `${name} : ${lastMessage?.message}`
              : "Start a conversation"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
