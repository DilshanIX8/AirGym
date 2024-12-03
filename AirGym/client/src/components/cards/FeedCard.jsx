/* eslint-disable react/prop-types */
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PiSpinnerBold } from "react-icons/pi";
import { errorToast, successToast } from "../../utils/toastify";
import { MdDelete } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

export default function FeedCard(props) {
  // access resume state
  const { user } = useSelector((state) => state.user);
  const [comments, setComments] = useState(props.comments);
  const [toggled, setToggled] = useState(false);
  const [likes, setLikes] = useState(props.likes);
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [loading, setLoading] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const fetchPostData = async () => {
    await axios
      .get(`/common/post/${props.id}`)
      .then((res) => {
        const post = res.data?.post;
        setComments(post.comments);
        setLikes(post._count.likes);
        setIsLiked(post.likes.length > 0);
      })
      .catch(() => {
        errorToast("An error occurred. Please try again.");
      });
  };

  // add comments
  const submitComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const content = e.target[0].value;
    await axios
      .post("/common/comment/" + props?.id, { content })
      .then(async () => {
        await fetchPostData();
      })
      .then(() => {
        successToast("Comment added successfully");
        e.target.reset();
      })
      .catch((err) => {
        errorToast(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // add or remove like
  const addOrRemoveLike = async () => {
    await axios
      .post("/common/like/" + props?.id)
      .then(async (res) => {
        successToast(res.data.message);
        await fetchPostData();
      })
      .catch((err) => {
        errorToast(err.message);
      });
  };

  return (
    <div className="overflow-hidden rounded-md border border-slate-800 bg-slate-900 text-slate-100">
      {/* delete alert */}
      <DeletePost
        user={user}
        isOpen={isPopUpOpen}
        setIsOpen={setIsPopUpOpen}
        postId={props.id}
      />

      {/* cover image */}
      <figure className="relative aspect-video">
        <img
          src={props.coverImage}
          alt="cover image"
          className="pointer-events-none w-full object-cover"
        />
        {/*  only show if user is admin or user is owner of the post */}
        {(user?.role === "ADMIN" ||
          (user && user?.username === props.proLink)) && (
          <button
            onClick={() => setIsPopUpOpen(true)}
            className="absolute end-2 top-2 z-[1] flex h-8 w-8 cursor-pointer rounded-full bg-white/80 p-1.5 text-red-500"
          >
            <MdDelete className="relative h-5 w-5" />
          </button>
        )}
      </figure>
      {/* post content */}
      <div className="border-y border-slate-800 p-4">
        {/* post header */}
        <header className="mb-4 flex gap-4">
          {/* left side : avatar */}
          <Link
            to={`/user/${props.proLink}`}
            className="relative inline-flex items-center justify-center rounded-full text-white"
          >
            {/* if image url is null */}
            {props.profilePicture == null && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-2xl uppercase">
                {props?.name?.charAt(0)}
              </div>
            )}

            {/* if image url is not null */}
            {props.profilePicture && (
              <img
                src={import.meta.env.VITE_APP_IMAGE_URL + props.profilePicture}
                alt={props.name.charAt(0).toUpperCase()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-2xl uppercase"
              />
            )}
          </Link>
          {/* right side author details */}
          <div>
            {/* post title */}
            <h3 className="text-xl font-medium text-slate-200">
              {props.title}
            </h3>

            {/* author name and date */}
            <p className="text-sm text-slate-400">
              By {props.name} , {props.date}
            </p>
          </div>
        </header>
        {/* content */}
        <p>{props.content}</p>
      </div>
      {/* Like Button and comment count */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-sm">
        {/* likes */}
        <button
          aria-label="Like"
          onClick={addOrRemoveLike}
          className={`flex items-center bg-transparent ${
            isLiked ? "text-red-500" : "text-gray-300"
          } focus:outline-none`}
        >
          <FaHeart />
          <span className="ps-2 text-gray-300">{likes}</span>
        </button>
        {/* comments */}
        <p className="">
          <span className="pe-2 text-gray-300">{comments.length}</span>
          Comments
        </p>
      </div>
      {/* Comment Section */}
      <div className="flex flex-col gap-y-4 py-4">
        {/* if user is logged is he/she will appear comment button */}
        {user && !props?.hideComment && (
          <form
            onSubmit={submitComment}
            className="flex flex-col items-end border-b border-slate-800 px-4 pb-4"
          >
            <textarea
              placeholder="Write your comment..."
              rows={4}
              className="w-full rounded-md border border-slate-600 bg-transparent px-2 py-1 text-sm text-white focus:border-orange-600 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex min-w-40 items-center justify-center rounded-md bg-orange-500 px-4 py-1.5 text-sm text-white hover:bg-orange-600 focus:bg-orange-600 focus:outline-none"
            >
              {loading && (
                <PiSpinnerBold className="mr-1 h-5 w-5 animate-spin font-bold" />
              )}
              Post Comment
            </button>
          </form>
        )}
        {/* comments section */}
        <div className="px-4">
          {comments
            .slice(0, toggled ? 2 : comments.length)
            .map((comment, index) => (
              <div
                key={index}
                className="mb-2 border-b border-b-slate-800 pb-2"
              >
                <p className="line-clamp-4 text-sm text-gray-100">
                  {comment.content}
                </p>
                <p className="text-xs text-gray-400">
                  By {comment.author.firstName} on{" "}
                  {new Date(comment.createdAt).toDateString()}
                </p>
              </div>
            ))}
          {comments.length > 2 && (
            <button
              onClick={() => setToggled((prev) => !prev)}
              className="mt-4 text-orange-500"
            >
              {toggled ? "Show Less" : "Show More"}
            </button>
          )}
          {/* if no comments found*/}
          {comments.length === 0 && (
            <p className="text-xs text-gray-300">No comments found</p>
          )}
        </div>
      </div>
    </div>
  );
}

const DeletePost = ({ user, isOpen, setIsOpen, postId }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // if user is admin
    let url = `/admin/posts/${postId}`;
    if (user.role !== "ADMIN") {
      url = `/common/post/${postId}`;
    }
    await axios
      .delete(url)
      .then(() => {
        successToast("Post deleted successfully");
        window.location.reload();
      })
      .catch((err) => {
        errorToast(err.response.data.error);
      })
      .finally(() => {
        setLoading(false);
        setIsOpen(false);
      });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the post
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-gray-400 hover:text-gray-500">
            Close
          </AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {loading ? "Deleting..." : "Delete Post"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
