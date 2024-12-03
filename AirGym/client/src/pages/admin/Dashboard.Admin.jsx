import AdminStatistics from "../../components/admin/Dashboard.Admin";
import AdminSideBar from "../../components/sideBars/SideBar.Admin";

const AdminDashboard = () => {
  return (
    <div className="w-full">
      {/* sidebar */}
      <AdminSideBar />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <AdminStatistics />
      </div>
    </div>
  );
};

export default AdminDashboard;
