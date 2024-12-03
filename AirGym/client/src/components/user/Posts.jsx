import { useCallback, useEffect, useState } from "react";
import FeedCard from "../cards/FeedCard";
import axios from "axios";
import { errorToast, successToast } from "../../utils/toastify";
import { transferZodErrors } from "../../utils/transfer-zod-errors";
import { PiSpinnerBold } from "react-icons/pi";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { IoCloudUpload } from "react-icons/io5";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState({
    posts: false,
    addPost: false,
  });
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    feed: null,
  });

  // handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add post
  const handleSubmit = (e) => {
    e.preventDefault();
    // clear errors
    setErrorMessage("");
    setValidationErrors({});

    setLoading((prev) => ({ ...prev, addPost: true }));

    axios
      .post("/common/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        successToast("Post added successfully");
        setFormData({
          title: "",
          content: "",
          feed: null,
        });
        setPosts([]); // clear posts
      })
      .then(async () => {
        await getPosts(); // refresh posts after adding a new one
      })
      .catch((err) => {
        if (err.response.data.error) setErrorMessage(err.response.data.error);
        else if (err.response.data.errors)
          setValidationErrors(
            transferZodErrors(err.response.data.errors).error,
          );
        else errorToast("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, addPost: false }));
      });
  };

  // Get posts
  const getPosts = useCallback(async () => {
    setLoading((prev) => ({ ...prev, posts: true }));
    await axios
      .get("/common/post")
      .then((res) => {
        setPosts(res.data.posts);
      })
      .catch((err) => {
        errorToast(err);
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, posts: false }));
      });
  }, []);

  useEffect(() => {
    getPosts(); // Initial fetch of posts
  }, [getPosts]);

  return (
    <div className="relative flex w-full flex-col-reverse items-center gap-8 xl:container xl:flex-row">
      {/* posts */}
      <div className="flex w-full max-w-2xl flex-col gap-8 xl:max-w-[50%] 2xl:w-[50%] 2xl:max-w-2xl">
        {/* loading */}
        {loading.posts && (
          <div className="flex h-32 items-center justify-center">
            <PiSpinnerBold className="h-10 w-10 animate-spin" />
          </div>
        )}
        {/* no post available */}
        {!loading.posts && posts.length === 0 && (
          <p className="text-center font-medium text-slate-300 border-t border-orange-400 pt-5 xl:border-none">
            No posts available. Add a new post to get started.
          </p>
        )}

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
            isLiked={data.likes.length > 0}
          />
        ))}
      </div>

      {/* add post */}
      <div className="h-fit w-full max-w-2xl rounded-md bg-gray-800 p-4 xl:fixed xl:start-[calc(50%_+_11rem)] xl:top-16 xl:w-[calc(50%_-13rem)]">
        <h2 className="pb-3 text-2xl font-medium text-orange-500">
          Add New Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* title */}
          <div>
            <Label htmlFor="title" className="mb-2">
              Title
            </Label>

            <Input
              id="title"
              name="title"
              type="text"
              autoComplete="title"
              required
              placeholder="Your post title"
              value={formData.title}
              onChange={handleChange}
            />

            {/* error message */}
            {validationErrors?.title && (
              <p className="mt-1 text-sm font-medium text-red-500">
                {validationErrors?.title}
              </p>
            )}
          </div>

          {/* content */}
          <div>
            <Label
              htmlFor="content"
              className="mb-2 flex w-full items-center justify-between"
            >
              Content <span className="">{formData.content.length}/1000</span>
            </Label>

            <Textarea
              id="content"
              name="content"
              required
              rows={5}
              maxLength={1000}
              placeholder="Your post content"
              value={formData.content}
              onChange={handleChange}
            />

            {/* error message */}
            {validationErrors?.content && (
              <p className="mt-1 text-sm font-medium text-red-500">
                {validationErrors?.content}
              </p>
            )}
          </div>

          {/* image */}
          <div>
            <Label htmlFor="image" className="mb-2">
              Image
            </Label>

            <Label className="mb-2">
              <Input
                id="image"
                name="feed"
                type="file"
                accept="image/*"
                className="peer sr-only w-0"
                onChange={(e) =>
                  setFormData({ ...formData, feed: e.target.files[0] })
                }
              />
              <div className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-600 py-8">
                <IoCloudUpload className="h-16 w-16 opacity-30" />

                <p className="text-xs font-medium text-slate-300">
                  {formData.feed ? formData.feed.name : "Upload an image"}
                </p>
              </div>
            </Label>

            {/* error message */}
            {validationErrors?.feed && (
              <p className="mt-1 text-sm font-medium text-red-500">
                {validationErrors?.feed}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-600"
            >
              {loading.addPost && (
                <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
              )}
              Add Post
            </button>
            {/* error message */}
            {errorMessage && (
              <p className="mt-3 text-center text-sm font-medium text-red-500">
                {errorMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Posts;
