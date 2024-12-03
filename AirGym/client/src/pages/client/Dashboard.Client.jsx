import ClientSideBar from "../../components/sideBars/SideBar.Client";
import ClientMeasurements from "../../components/client/Measurements.Client.jsx";
import ClientAnalytics from "../../components/client/Analytics.Client";
import { useSelector } from "react-redux";

const ClientDashboard = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full">
      {/* sidebar */}
      <ClientSideBar />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        {user._count?.figureDetails === 0 ? (
          <ClientMeasurements />
        ) : (
          <ClientAnalytics />
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
