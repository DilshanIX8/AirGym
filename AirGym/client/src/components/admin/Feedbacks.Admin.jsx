import { useCallback, useEffect, useState } from "react";
import { errorToast } from "../../utils/toastify";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

/* eslint-disable react/prop-types */
const AdminViewFeedback = () => {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    page: 1,
  });

  const getIssues = useCallback(async () => {
    await axios
      .get(`/admin/feedback?page=${pagination.page}`)
      .then(({ data }) => {
        setData(data.feedbacks);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages,
        }));
      })
      .catch(() => {
        errorToast("Failed to get feedbacks");
      });
  }, [pagination.page]);

  useEffect(() => {
    getIssues();
  }, [getIssues]);

  return (
    <div className="w-full xl:container">
      <h1 className="flex items-center justify-center gap-x-1 pb-5 text-center text-base font-semibold text-orange-100 sm:text-xl lg:text-2xl xl:pb-8">
       Feedbacks
      </h1>

      {/* feedbacks */}
      <div className="">
        {data?.map((feedback, id) => (
          <div
            key={id}
            className="mt-4 flex flex-col border-b border-orange-400/70 py-4 shadow-md"
          >
            <div className="flex items-center justify-between text-sm text-gray-400">
              <p className="">
                Feedback By {feedback.user.firstName} {feedback.user.lastName}{" "}
                at <span>{new Date(feedback.createdAt).toDateString()}</span>
              </p>
            </div>
            <p className="mt-2">{feedback.feedback}</p>
          </div>
        ))}

        {/* if no data found */}
        {data?.length < 1 && (
          <div className="mt-10 flex items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-200">
              No feedbacks found
            </h2>
          </div>
        )}

        {/* pagination */}
        {data?.length > 1 && (
          <div className="mt-2 flex w-full items-center justify-between">
            {/* pages details */}
            <p className="w-full text-sm font-medium text-gray-200">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <Pagination className={"w-fit"}>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      pagination.page <= 1 ? "pointer-events-none" : ""
                    }
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className={
                      pagination.page + 1 > pagination.totalPages
                        ? "pointer-events-none"
                        : ""
                    }
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminViewFeedback;
