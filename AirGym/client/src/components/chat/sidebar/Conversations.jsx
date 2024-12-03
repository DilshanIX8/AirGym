import { PiSpinnerBold } from "react-icons/pi";
import useGetConversations from "../../../hooks/useGetConversations";
import Conversation from "./Conversation";
import { useSelector } from "react-redux";

const Conversations = () => {
  const { loading } = useGetConversations();
  const { conversations } = useSelector((state) => state.chat);

  return (
    <div className="flex flex-col overflow-auto py-2">
      {conversations?.map((conversation) => (
        <Conversation key={conversation?.id} conversation={conversation} />
      ))}
      {loading && (
        <div className="flex w-full items-center justify-center">
          <PiSpinnerBold className="h-5 w-5 animate-spin" />
        </div>
      )}
      {/*  no conversations */}
      {!loading && (!conversations || conversations?.length === 0) ? (
        <div className="mt-4 text-center text-gray-500">No conversations</div>
      ) : null}
    </div>
  );
};

export default Conversations;
