import AdminSideBar from "../../components/sideBars/SideBar.Admin";
import AdminCoachVerificationTable from "../../components/table/CoachVerification.Admin";

const AdminCoachManagement = () => {
  return (
    <div className="w-full">
      {/* sidebar */}
      <AdminSideBar />

      {/* main content area */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <AdminCoachVerificationTable />
      </div>
    </div>
  );
};

export default AdminCoachManagement;
