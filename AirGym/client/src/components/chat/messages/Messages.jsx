import { useEffect, useRef } from "react";
import useGetMessages from "../../../hooks/useGetMessages";
import Message from "./Message";
import { Skeleton } from "../../ui/skeleton";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="flex flex-col gap-y-3 overflow-auto px-4">
      {!loading &&
        messages?.length > 0 &&
        messages?.map((message, id) => (
          <div key={id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))}
      {loading && [...Array(5)].map((_, idx) => <Skeleton key={idx} />)}
      {!loading && messages?.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};

export default Messages;
