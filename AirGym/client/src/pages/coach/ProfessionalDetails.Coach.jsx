import ProfessionalDetails from "../../components/coach/ProfessionalDetails.Coach";
import CoachSideBar from "../../components/sideBars/SideBar.Coach";
import { PiSpinnerBold } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CoachProfessionalDetails = () => {
  const { role } = useSelector((state) => state.user);
  const [isProgress, setIsProgress] = useState(true);
  const navigate = useNavigate();

  // check if coach is verified
  // if coach is not verified, redirect to coach page
  useEffect(() => {
    if (role?.coachVerified === "VERIFIED") {
      setIsProgress(false);
    } else {
      navigate("/coach");
    }
  }, [navigate, role]);

  // if isProgress is true, show loading spinner
  if (isProgress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <PiSpinnerBold className="mr-1 h-14 w-14 animate-spin font-bold text-orange-400" />
      </div>
    );
  }
  return (
    <div className="w-full">
      {/* sidebar */}
      <CoachSideBar />

      {/* main content area */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <ProfessionalDetails />
      </div>
    </div>
  );
};

export default CoachProfessionalDetails;
