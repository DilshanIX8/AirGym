import { useCallback, useEffect, useState } from "react";
import { errorToast } from "../utils/toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setConversations } from "../state/chat-slice";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const { search } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const getConversations = useCallback(async () => {
    setLoading(true);
    // url
    let url = "/common/chat";
    if (search) {
      url = `/common/chat?search=${search}`;
    }
    await axios
      .get(url)
      .then(({ data }) => {
        dispatch(setConversations(data?.users));
      })
      .catch((error) => {
        errorToast(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, search]);

  useEffect(() => {
    getConversations();
  }, [getConversations]);
  return { loading };
};

export default useGetConversations;
