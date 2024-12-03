import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeedCard from "../components/cards/FeedCard";
import axios from "axios";
import { BiSolidError } from "react-icons/bi";
import { BsInfoCircleFill } from "react-icons/bs";

const PublicFeed = () => {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFeedData = useCallback(async () => {
    setLoading(true);
    await axios
      .get("/public/post")
      .then((res) => {
        setFeedData(res.data?.posts);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getFeedData();
  }, [getFeedData]);

  return (
    <div>
      {/* navbar */}
      <Navbar />

      <div className="flex justify-center px-2 pt-24">
        <div className="mx-4 flex w-full max-w-2xl flex-col gap-8 py-8">
          {/* if loading */}
          {loading && <p className="max-w-3xl text-white">Loading...</p>}
          {/* if error */}
          {error && !loading && (
            <p className="flex w-full max-w-3xl items-center justify-center gap-x-2 rounded-md bg-red-500/80 p-2 text-white">
              <BiSolidError className="h-6 w-6" /> {error}
            </p>
          )}
          {/* if no post found and no errors or not a loading*/}
          {feedData.length === 0 && !loading && !error && (
            <p className="flex w-full max-w-3xl items-center justify-center gap-x-2 rounded-md bg-slate-600 p-2 text-white">
              <BsInfoCircleFill className="h-5 w-5" />
              No post found
            </p>
          )}
          {feedData.map((data, index) => (
            <FeedCard
              key={index}
              coverImage={import.meta.env.VITE_APP_IMAGE_URL + data?.image}
              profilePicture={data?.author?.profileImage}
              title={data?.title}
              ProfileUrl={"/user/" + data?.author?.username}
              date={new Date(data.createdAt).toDateString()}
              name={data?.author?.firstName + " " + data?.author?.lastName}
              content={data?.content}
              likes={data?._count?.likes}
              proLink={data?.author?.username}
              id={data?.id}
              comments={data?.comments}
              isLiked={data?.likes?.length > 0}
            />
          ))}
        </div>
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default PublicFeed;
