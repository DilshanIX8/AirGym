import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { errorToast } from "../../utils/toastify";
import { PiSpinnerBold } from "react-icons/pi";
import FeedCard from "../cards/FeedCard";

const AdminPosts = () => {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    await axios
      .get(`/admin/posts?search=${search}`)
      .then(({ data }) => {
        setPosts(data.posts);
      })
      .catch((err) => {
        errorToast(err.response.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full xl:container">
      <h1 className="flex items-center justify-center gap-x-1 pb-5 text-center text-base font-semibold text-orange-100 sm:text-xl lg:text-2xl xl:pb-8">
        Manage Posts
      </h1>

      <div className="flex w-full flex-col items-center gap-y-3">
        <div className="mb-5 flex w-full max-w-2xl flex-col gap-2 sm:flex-row">
          <Input
            type="text"
            placeholder="Search posts by user's name or post title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={fetchPosts}>Search</Button>
        </div>
        {/* loading */}
        {loading && (
          <div className="flex w-full items-center justify-center gap-x-1">
            <PiSpinnerBold className="mr-1 h-8 w-8 animate-spin font-bold" />
          </div>
        )}
        {/* no post available */}
        {posts?.length === 0 && !loading && (
          <div className="flex w-full items-center justify-center gap-x-1 text-gray-300">
            <p>No posts available</p>
          </div>
        )}
        <div className="flex w-full max-w-2xl flex-col gap-y-4">
          {/* posts */}
          {posts.map((data, index) => (
            <FeedCard
              key={index}
              coverImage={import.meta.env.VITE_APP_IMAGE_URL + data.image}
              profilePicture={data.author.profileImage}
              title={data.title}
              ProfileUrl={"/user/" + data.author.username}
              date={new Date(data.createdAt).toDateString()}
              name={data.author.firstName + " " + data.author.lastName}
              content={data.content}
              likes={data._count.likes}
              proLink={data?.author?.username}
              id={data.id}
              comments={data.comments}
              isLiked={false}
              hideComment={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPosts;
