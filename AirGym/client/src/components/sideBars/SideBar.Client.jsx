import {
  MdAccessTimeFilled,
  MdDashboard,
  MdOutlinePostAdd,
} from "react-icons/md";
import { FaPencilRuler } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { IoMdArrowRoundBack } from "react-icons/io";
import Sidebar from "./SideBar";
import { IoChatbox } from "react-icons/io5";

const urls = [
  {
    icon: <MdDashboard />,
    name: "Dashboard",
    link: "/client",
  },
  {
    icon: <FaPencilRuler />,
    name: "Measurements",
    link: "/client/measurements",
  },
  {
    icon: <MdAccessTimeFilled />,
    name: "Appointments",
    link: "/client/appointments",
  },
  {
    icon: <IoChatbox />,
    name: "Chat",
    link: "/client/chat",
  },
  {
    icon: <MdOutlinePostAdd />,
    name: "My Posts",
    link: "/client/posts",
  },
  {
    icon: <TbListDetails />,
    name: "Details",
    link: "/client/general",
  },
  {
    icon: <IoMdArrowRoundBack />,
    name: "Back To Home",
    link: "/",
  },
];

const ClientSideBar = () => {
  return <Sidebar urls={urls} />;
};

export default ClientSideBar;
