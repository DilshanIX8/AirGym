import AdminSideBar from "../../components/sideBars/SideBar.Admin";
import AdminAppointmentsTable from "../../components/table/Appointments.Admin";

const AdminAppointments = () => {
  return (
    <div className="w-full">
      {/* sidebar */}
      <AdminSideBar />

      {/* main content area */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <AdminAppointmentsTable />
      </div>
    </div>
  );
};

export default AdminAppointments;
