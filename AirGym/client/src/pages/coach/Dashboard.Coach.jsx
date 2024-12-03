import { useState } from "react";
import CoachUploadImages from "../../components/coach/UploadImages.Coach";
import CoachGeneralDetails from "../../components/coach/GeneralDetails.Coach";
import CoachProfessionalDetails from "../../components/coach/ProfessionalDetails.Coach";
import CoachPaymentDetails from "../../components/coach/PaymentDetails.Coach";
import CoachSubmissionConfirmation from "../../components/coach/SubmissionConfirmation.Coach";
import { useSelector } from "react-redux";
import CoachSideBar from "../../components/sideBars/SideBar.Coach";
import CoachStatistics from "../../components/coach/Dashboard.Coach";

const CoachDashboard = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isReSubmit, setIsReSubmit] = useState(false);
  const { role } = useSelector((state) => state.user);

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const sections = [
    <CoachGeneralDetails key={1} handleNext={handleNext} />,
    <CoachProfessionalDetails key={2} handleNext={handleNext} />,
    <CoachUploadImages key={3} handleNext={handleNext} />,
    <CoachPaymentDetails key={4} handleNext={handleNext} />,
    <CoachSubmissionConfirmation key={5} setIsReSubmit={setIsReSubmit} />,
  ];

  return (
    <div className="w-full">
      {/* sidebar */}
      <CoachSideBar />

      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        {/* if status is reject */}
        {role?.coachVerified === "REJECTED" && !isReSubmit && (
          <div className="flex min-h-[calc(100vh_-_8rem)] flex-col items-center justify-center">
            <h2 className="mb-4 text-2xl font-bold">Profile Rejected</h2>
            <p className="text-center text-red-400">
              Your profile is rejected. Please update your profile and submit
              again.
            </p>

            {/* resubmit button */}
            <button
              className="mt-5 rounded-md bg-green-600 px-4 py-2 font-medium"
              onClick={() => setIsReSubmit(true)}
            >
              Resubmit Details
            </button>
          </div>
        )}
        {/*  if status is pending */}
        {role?.coachVerified === "PENDING" && (
          <div className="flex min-h-[calc(100vh_-_8rem)] flex-col items-center justify-center">
            <h2 className="mb-4 text-2xl font-bold">Profile Verification</h2>
            <p className="text-center text-amber-400">
              Your profile is under verification. We will notify you once the
              verification process is complete.
            </p>
          </div>
        )}
        {/* Show welcome message if profile is verified */}
        {role?.coachVerified === "VERIFIED" && (
          <div className="flex min-h-[calc(100vh_-_8rem)] w-full flex-col items-center justify-center">
            <CoachStatistics />
          </div>
        )}
        {/* show submit details sections */}
        {(role?.coachVerified === "NOT_SUBMITTED" || isReSubmit) && (
          // section progress bar
          <div className="flex w-full flex-col items-center">
            <div className="mb-10 flex items-center justify-center gap-x-4">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                    currentSection >= index
                      ? "bg-orange-500"
                      : "border-2 border-orange-500"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            {sections[currentSection]}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachDashboard;
