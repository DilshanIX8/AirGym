/* eslint-disable react/prop-types */
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { errorToast, successToast } from "../../utils/toastify";
import { PiSpinnerBold } from "react-icons/pi";
import { IoIosShareAlt } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    await axios
      .get(`/admin/users?search=${search}`)
      .then(({ data }) => {
        setUsers(data.users);
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
        Manage Users
      </h1>

      {/* delete or restore user pop up */}
      <DeleteOrRestoreUser
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={selectedUser}
      />

      <div className="flex w-full flex-col items-center gap-y-3">
        <div className="mb-5 flex w-full max-w-2xl flex-col gap-2 sm:flex-row">
          <Input
            type="text"
            placeholder="Search users by name, email or username"
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
        {users?.length === 0 && !loading && (
          <div className="flex w-full items-center justify-center gap-x-1 text-gray-300">
            <p>No users available</p>
          </div>
        )}
        <div className="flex w-full max-w-2xl flex-col gap-y-4">
          {/* users */}
          {users.map((data, index) => (
            <div className="border-b border-orange-400 pb-2" key={index}>
              <div className="flex items-center gap-x-2">
                <img
                  src={import.meta.env.VITE_APP_IMAGE_URL + data.profileImage}
                  alt={data.username}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex w-full flex-col">
                  <div className="flex w-full items-center justify-between text-lg font-semibold text-gray-100">
                    <div className="flex items-center gap-x-1">
                      {data?.firstName} {data?.lastName}
                      {/* if role is coach */}
                      {data?.role === "COACH" && (
                        <p className="flex items-center gap-x-1 px-2 text-sm font-medium">
                          <FaStar className="text-amber-400" />
                          {data?.coach?.ratings.toFixed(1)}
                        </p>
                      )}
                      <Link
                        to={`/user/${data?.username}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-green-400"
                      >
                        <IoIosShareAlt />
                      </Link>
                    </div>
                    <p
                      className={`rounded-full border capitalize ${data.role !== "DELETED" ? "border-green-400 text-green-400" : "border-red-500 text-red-500"} px-4 text-xs`}
                    >
                      {data?.role === "DELETED"
                        ? "Disabled"
                        : data?.role.toLowerCase()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">{data.email}</p>
                </div>
              </div>
              <div className="-mt-2 flex items-center justify-end gap-x-2">
                <Button
                  onClick={() => {
                    setSelectedUser(data);
                    setIsOpen(true);
                  }}
                  className={`${data?.role !== "DELETED" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
                >
                  {data.role !== "DELETED" ? "Disable" : "Restore"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DeleteOrRestoreUser = ({ user, isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .delete(`/admin/users/${user?.id}`)
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
            This action cannot be undone. This will affect user&apos;s account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-gray-400 hover:text-gray-500">
            Close
          </AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            className={`${user?.role !== "DELETED" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
          >
            {user?.role !== "DELETED" && (
              <span className="">
                {loading ? "Disabling..." : "Disable Account"}
              </span>
            )}
            {user?.role === "DELETED" && (
              <span className="">
                {loading ? "Restoring..." : "Restore Account"}
              </span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminUsers;
