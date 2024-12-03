import CoachSideBar from "../../components/sideBars/SideBar.Coach";
import Posts from "../../components/user/Posts";

const CoachPosts = () => {
  return (
    <div className="w-full">
      {/* sidebar */}
      <CoachSideBar />

      {/* main content area */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <Posts />
      </div>
    </div>
  );
};

export default CoachPosts;
