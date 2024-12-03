import AdminSideBar from "../../components/sideBars/SideBar.Admin";
import AdminPaymentsTable from "../../components/table/Payments.Admin";

const AdminPayments = () => {
  return (
    <div className="w-full">
      {/* sidebar */}
      <AdminSideBar />

      {/* main content area */}
      <div className="flex w-full flex-col justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <AdminPaymentsTable />
      </div>
    </div>
  );
};

export default AdminPayments;
