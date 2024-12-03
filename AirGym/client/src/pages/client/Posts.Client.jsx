import ClientSideBar from "../../components/sideBars/SideBar.Client";
import Posts from "../../components/user/Posts";

const ClientPosts = () => {
  return (
    <div className="w-full">
      {/* sidebar */}
      <ClientSideBar />

      {/* main content area */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <Posts />
      </div>
    </div>
  );
};

export default ClientPosts;
