/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { extractTime } from "../../../utils/extractTime";

const Message = ({ message }) => {
  const { user } = useSelector((state) => state.user);
  const { sender } = useSelector((state) => state.chat);
  const fromMe = message?.sender === user?.username;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "ml-auto" : "";
  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";
  const name = fromMe ? "You" : `${sender?.firstName} ${sender?.lastName}`;

  return (
    <div className={`chat ${chatClassName} w-[95%]`}>
      <div
        className={`chat-bubble text-white ${bubbleBgColor} rounded-md px-2 py-2 text-sm`}
      >
        <p className="mb-1 text-xs font-medium italic text-gray-300">{name}</p>
        <p className="">{message.message}</p>
      </div>
      <div className="chat-footer flex items-center gap-1 text-xs opacity-50">
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
