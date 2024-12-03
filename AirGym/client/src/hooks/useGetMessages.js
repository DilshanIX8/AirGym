import { useCallback, useState } from "react";
import { useEffect } from "react";
import { errorToast } from "../utils/toastify";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../state/chat-slice";
import axios from "axios";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, selectedConversation } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const getMessages = useCallback(async () => {
    if (!selectedConversation) return;
    setLoading(true);
    await axios
      .get(`/common/chat/${selectedConversation.id}`)
      .then(({ data }) => {
        dispatch(setMessages(data?.messages));
      })
      .catch(() => {
        errorToast("Failed to get messages");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, selectedConversation]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  return { messages, loading };
};

export default useGetMessages;
