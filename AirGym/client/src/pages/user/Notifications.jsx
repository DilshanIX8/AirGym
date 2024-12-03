import { useCallback, useEffect, useState } from "react";
import { errorToast } from "../../utils/toastify";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

/* eslint-disable react/prop-types */
const CommonNotifications = ({ children }) => {
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [data, setData] = useState(null);
  const [issueId, setIssueId] = useState(null);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    page: 1,
  });

  const getIssues = useCallback(async () => {
    await axios
      .get(`/common/issues?page=${pagination.page}`)
      .then(({ data }) => {
        setData(data.issues);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages,
        }));
      })
      .catch(() => {
        errorToast("Failed to get issues");
      });
  }, [pagination.page]);

  useEffect(() => {
    getIssues();
  }, [getIssues]);

  return (
    <div className="w-full">
      {/* sidebar */}
      {children}

      {/* main content area */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <div className="w-full xl:container">
          <h1 className="flex items-center justify-center gap-x-1 pb-5 text-center text-base font-semibold text-orange-100 sm:text-xl lg:text-2xl xl:pb-8">
            Issues
          </h1>

          {/* submit response pop up */}
          <ViewIssues
            isOpen={isIssueOpen}
            setIsOpen={setIsIssueOpen}
            issueId={issueId}
          />

          {/* issues */}
          <div className="">
            {data?.map((issue) => (
              <div
                key={issue.issueId}
                className="mt-4 flex flex-col border-b border-orange-400/70 py-4 shadow-md"
              >
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <p className="flex gap-x-2">
                    <span>
                      Issue by me at {new Date(issue.createdAt).toDateString()}
                    </span>
                    <span className="rounded-full border border-orange-400 px-4 text-xs italic text-orange-400">
                      {issue.response ? "Responded" : "Pending"}
                    </span>
                  </p>
                  <p className="flex gap-x-2">Issue ID: {issue.issueId}</p>
                </div>
                <p className="mt-2 font-medium">Issue : </p>
                <p className="line-clamp-2">{issue.issue}</p>
                {/* if response is available */}
                {issue.response && (
                  <>
                    <p className="mt-2 font-medium">Response : </p>
                    <p className="line-clamp-2">Issue : {issue.response}</p>
                  </>
                )}
                <div className="mt-2 flex items-center justify-end">
                  <Button
                    type="button"
                    className="bg-orange-500 text-xs font-semibold text-white hover:bg-orange-600"
                    onClick={() => {
                      setIssueId(issue.issueId);
                      setIsIssueOpen(true);
                    }}
                  >
                    View Issue
                  </Button>
                </div>
              </div>
            ))}

            {/* if no data found */}
            {data?.length < 1 && (
              <div className="mt-10 flex items-center justify-center">
                <h2 className="text-lg font-semibold text-gray-200">
                  No issues found
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
      </div>
    </div>
  );
};
const ViewIssues = ({ isOpen, setIsOpen, issueId }) => {
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState(null);

  const getIssue = useCallback(async () => {
    setLoading(true);
    await axios
      .get(`/common/issues/${issueId}`)
      .then(({ data }) => {
        setIssue(data.issue);
      })
      .catch((err) => {
        if (err?.response?.data.error) errorToast(err.response.data.error);
        else errorToast("Failed to get issue");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [issueId]);

  useEffect(() => {
    if (isOpen) {
      getIssue();
    }
  }, [getIssue, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {loading && <span className="">Loading...</span>}
            {!issue && (
              <span className="">No issue found with ID: {issueId}</span>
            )}
            {!loading && issue && (
              <span className="">
                Issue ID: {issueId}{" "}
                {issue?.response ? "(Responded)" : "(Pending)"}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs font-medium">
            {!loading && issue && (
              <span className="">
                Issue by me at {new Date(issue?.createdAt).toDateString()}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        {!loading && issue && (
          <div className="flex flex-col gap-2">
            {/* issue */}
            <div className="mt-3">
              <p className="flex justify-between font-medium">
                Issue
                <span className="text-xs text-gray-400">
                  {new Date(issue?.createdAt).toDateString()}
                </span>
              </p>
              <p className="text-sm text-gray-200">{issue?.issue}</p>
            </div>
            {/* response */}
            <div className="mt-3">
              <p className="flex justify-between font-medium">
                Response
                <span className="text-xs text-gray-400">
                  {new Date(issue?.updatedAt).toDateString()}
                </span>
              </p>
              <p className="text-sm text-gray-200">
                {issue?.response ? issue.response : "No response yet"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommonNotifications;
