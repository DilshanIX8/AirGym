import { useState } from "react";
import { errorToast } from "../utils/toastify";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../state/chat-slice";
import axios from "axios";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, sender } = useSelector(
    (state) => state.chat,
  );
  const dispatch = useDispatch();

  const sendMessage = async (message) => {
    setLoading(true);

    await axios
      .post(`/common/chat/send/${sender.username}`, { message })
      .then(({ data }) => {
        dispatch(setMessages([...messages, data]));
      })
      .catch(() => {
        errorToast("Failed to send message");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loading, sendMessage };
};

export default useSendMessage;
