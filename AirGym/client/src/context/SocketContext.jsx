/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => state.user);

  const getSocketConnection = useCallback(() => {
    try {
      if (user) {
        const socket = io("http://localhost:8000", {
          query: {
            userId: user.username,
          },
        });
        setSocket(socket);
        socket.on("getOnlineUsers", (users) => {
          setOnlineUsers(users);
        });
        return () => {
          socket.close();
        };
      } else {
        if (socket) {
          socket.close();
          setSocket(null);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  useEffect(() => {
    getSocketConnection();
  }, [getSocketConnection]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
