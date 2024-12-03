import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import axios from "axios";
import RequireAuth from "./components/RequireAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PublicFeed from "./pages/PublicFeed";
import ContactUs from "./pages/ContactUs";
import AboutUS from "./pages/AboutUs";
import CouchFilter from "./pages/CouchFilter";
import PublicProfile from "./pages/PublicProfile";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// coach
import CoachGeneralDetails from "./pages/coach/GeneralDetails.Coach";
import CoachPaymentDetails from "./pages/coach/PaymentDetails.Coach";
import CoachDashboard from "./pages/coach/Dashboard.Coach";
import CoachProfessionalDetails from "./pages/coach/ProfessionalDetails.Coach";
import CoachAppointments from "./pages/coach/Appointments.Coach";
import CoachPosts from "./pages/coach/Posts.Coach";
import CoachClients from "./pages/coach/Clients.Coach";
import CoachClientAnalytics from "./pages/coach/Analytics.Coach";
import CoachEarnings from "./pages/coach/Earnings.Coach";

// client
import ClientDashboard from "./pages/client/Dashboard.Client";
import ClientDetails from "./pages/client/GeneralDetails.Client";
import ClientAddMeasurements from "./pages/client/AddMeasurements.Client";
import ClientAppointments from "./pages/client/Appointments.Client";
import ClientPosts from "./pages/client/Posts.Client";

// admin
import AdminDashboard from "./pages/admin/Dashboard.Admin";
import AdminUserManagement from "./pages/admin/Users.Admin";
import AdminIssues from "./pages/admin/Issues.Admin";
import AdminFeedbacks from "./pages/admin/Feedbacks.Admin";
import AdminPostManagement from "./pages/admin/Posts.Admin";
import AdminCoachManagement from "./pages/admin/Coaches.Admin";

// common
import ChatBox from "./pages/user/ChatBox";
import CommonNotifications from "./pages/user/Notifications";

// others
import ClientSideBar from "./components/sideBars/SideBar.Client";
import CoachSideBar from "./components/sideBars/SideBar.Coach";
import AdminPayments from "./pages/admin/Payment.Admin";
import AdminAppointments from "./pages/admin/Appointments.Admin";

const ROLES = {
  Client: "CLIENT",
  Coach: "COACH",
  Admin: "ADMIN",
};

function App() {
  // setup axios default base url
  axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
  axios.defaults.withCredentials = true;

  return (
    <main>
      {/* react toastify toast container */}
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about-us" element={<AboutUS />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/feed" element={<PublicFeed />} />
          <Route path="/couches" element={<CouchFilter />} />
          <Route path="/user/:username" element={<PublicProfile />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* user routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Client]} />}>
            <Route path="/client" element={<Outlet />}>
              <Route index element={<ClientDashboard />} />
              <Route path="general" element={<ClientDetails />} />
              <Route path="measurements" element={<ClientAddMeasurements />} />
              <Route path="appointments" element={<ClientAppointments />} />
              <Route path="posts" element={<ClientPosts />} />
              <Route path="chat" element={<ChatBox />} />
              <Route
                path="notifications"
                element={
                  <CommonNotifications>
                    <ClientSideBar />
                  </CommonNotifications>
                }
              />
            </Route>
          </Route>

          {/* coach routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Coach]} />}>
            <Route path="/coach" element={<Outlet />}>
              <Route index element={<CoachDashboard />} />
              <Route path="general" element={<CoachGeneralDetails />} />
              <Route
                path="professionals"
                element={<CoachProfessionalDetails />}
              />
              <Route path="payments" element={<CoachPaymentDetails />} />
              <Route path="appointments" element={<CoachAppointments />} />
              <Route path="posts" element={<CoachPosts />} />
              <Route path="chat" element={<ChatBox />} />
              <Route path="clients" element={<CoachClients />} />
              <Route path="earnings" element={<CoachEarnings />} />
              <Route
                path="analytics/:client"
                element={<CoachClientAnalytics />}
              />
              <Route
                path="notifications"
                element={
                  <CommonNotifications>
                    <CoachSideBar />
                  </CommonNotifications>
                }
              />
            </Route>
          </Route>

          {/* admin routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="/admin" element={<Outlet />}>
              <Route index element={<AdminDashboard />} />
              <Route path="verify-coach" element={<AdminCoachManagement />} />
              <Route path="issues" element={<AdminIssues />} />
              <Route path="feedbacks" element={<AdminFeedbacks />} />
              <Route path="posts" element={<AdminPostManagement />} />
              <Route path="users" element={<AdminUserManagement />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="appointments" element={<AdminAppointments />} />
            </Route>
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
