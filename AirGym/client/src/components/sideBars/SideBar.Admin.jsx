import {
  MdAccessTimeFilled,
  MdApproval,
  MdDashboard,
  MdFeedback,
} from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { ImUsers } from "react-icons/im";
import Sidebar from "./SideBar";
import { BsPostcardFill } from "react-icons/bs";
import { RiSecurePaymentLine } from "react-icons/ri";

const urls = [
  {
    icon: <MdDashboard />,
    name: "Dashboard",
    link: "/admin",
  },
  {
    icon: <MdApproval />,
    name: "Coach Verification",
    link: "/admin/verify-coach",
  },
  {
    icon: <MdAccessTimeFilled />,
    name: "Manage Appointments",
    link: "/admin/appointments",
  },
  {
    icon: <ImUsers />,
    name: "Manage Users",
    link: "/admin/users",
  },
  {
    icon: <BsPostcardFill />,
    name: "Manage Posts",
    link: "/admin/posts",
  },
  {
    icon: <RiSecurePaymentLine />,
    name: "Manage Payments",
    link: "/admin/payments",
  },
  {
    icon: <AiOutlineIssuesClose />,
    name: "Issues",
    link: "/admin/issues",
  },
  {
    icon: <MdFeedback />,
    name: "Feedbacks",
    link: "/admin/feedbacks",
  },
  {
    icon: <IoMdArrowRoundBack />,
    name: "Back To Home",
    link: "/",
  },
];

const AdminSideBar = () => {
  return <Sidebar urls={urls} isAdmin={true} />;
};

export default AdminSideBar;
