import {
  MdAccessTimeFilled,
  MdDashboard,
  MdGroups,
  MdOutlinePostAdd,
  MdOutlineWork,
  MdPayments,
} from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { IoMdArrowRoundBack } from "react-icons/io";
import Sidebar from "./SideBar";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoChatbox } from "react-icons/io5";

const urls = [
  {
    icon: <MdDashboard />,
    name: "Dashboard",
    link: "/coach",
  },
  {
    icon: <MdAccessTimeFilled />,
    name: "Appointments",
    link: "/coach/appointments",
  },
  {
    icon: <IoChatbox />,
    name: "Chat",
    link: "/coach/chat",
  },
  {
    icon: <MdOutlinePostAdd />,
    name: "My Posts",
    link: "/coach/posts",
  },
  {
    icon: <FaMoneyBillTrendUp />,
    name: "Earnings",
    link: "/coach/earnings",
  },
  {
    icon: <MdGroups />,
    name: "Clients",
    link: "/coach/clients",
  },
  {
    icon: <TbListDetails />,
    name: "General Details",
    link: "/coach/general",
  },
  {
    icon: <MdOutlineWork />,
    name: "Professional Details",
    link: "/coach/professionals",
  },
  {
    icon: <MdPayments />,
    name: "Payment Details",
    link: "/coach/payments",
  },
  {
    icon: <IoMdArrowRoundBack />,
    name: "Back To Home",
    link: "/",
  },
];

const CoachSideBar = () => {
  return <Sidebar urls={urls} />;
};

export default CoachSideBar;
