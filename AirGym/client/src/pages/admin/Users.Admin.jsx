import AdminUsers from "../../components/admin/Users.Admin";
import AdminSideBar from "../../components/sideBars/SideBar.Admin";

const AdminUserManagement = () => {
  return (
    <div className="w-full">
      {/* sidebar */}
      <AdminSideBar />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <AdminUsers />
      </div>
    </div>
  );
};

export default AdminUserManagement;
