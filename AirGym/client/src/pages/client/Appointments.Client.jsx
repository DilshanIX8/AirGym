import ClientSideBar from "../../components/sideBars/SideBar.Client";
import ClientAppointmentsTable from "../../components/table/Appointments.Clients";

const ClientAppointments = () => {
  return (
    <div className="w-full">
      {/* sidebar */}
      <ClientSideBar />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <ClientAppointmentsTable />
      </div>
    </div>
  );
};

export default ClientAppointments;
