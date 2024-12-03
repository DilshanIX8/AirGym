import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setConversations, setMessages } from "../state/chat-slice";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio("/audio/notification.mp3");
      sound.play();
      dispatch(setMessages([...messages, newMessage]));
    });

    socket?.on("updatedSidebar", (conversation) => {
      dispatch(setConversations(conversation));
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("updatedSidebar");
    };
  }, [socket, messages, dispatch]);
};

export default useListenMessages;
