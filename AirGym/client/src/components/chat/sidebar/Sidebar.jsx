import { useDispatch, useSelector } from "react-redux";
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { setSelectedConversation } from "../../../state/chat-slice";

const Sidebar = () => {
  const { selectedConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div
      className={`relative w-full border-slate-500 p-4 md:w-[40%] md:border-r xl:w-[30%] ${selectedConversation ? "hidden flex-col md:flex" : "flex flex-col"}`}
    >
      <SearchInput />
      <Conversations />
      {/* back to dashboard button */}
      <div className="absolute bottom-2 w-[calc(100%_-_2rem)]">
        <button
          className="flex w-full items-center justify-center gap-x-2 rounded bg-orange-700 px-4 py-3 text-sm font-medium"
          onClick={() => {
            dispatch(setSelectedConversation(null));
            navigate(user.role === "COACH" ? "/coach" : "/client");
          }}
        >
          <IoMdArrowRoundBack className="h-5 w-5" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
