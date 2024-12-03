import { useCallback, useEffect, useState } from "react";
import { errorToast, successToast } from "../../utils/toastify";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

/* eslint-disable react/prop-types */
const AdminIssueResponse = () => {
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [data, setData] = useState(null);
  const [issue, setIssue] = useState(null);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    page: 1,
  });

  const getIssues = useCallback(async () => {
    await axios
      .get(`/admin/issues?page=${pagination.page}`)
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
    <div className="w-full xl:container">
      <h1 className="flex items-center justify-center gap-x-1 pb-5 text-center text-base font-semibold text-orange-100 sm:text-xl lg:text-2xl xl:pb-8">
        Issues
      </h1>

      {/* submit response pop up */}
      <SubmitResponse
        isOpen={isIssueOpen}
        setIsOpen={setIsIssueOpen}
        getIssues={getIssues}
        issue={issue}
      />

      {/* issues */}
      <div className="">
        {data?.map((issue) => (
          <div
            key={issue.issueId}
            className="mt-4 flex flex-col border-b border-orange-400/70 py-4 shadow-md"
          >
            <div className="flex items-center justify-between text-sm text-gray-400">
              <p className="">
                Issue By {issue.user.firstName} {issue.user.lastName} at{" "}
                <span>{new Date(issue.createdAt).toDateString()}</span>
              </p>
              <p className="">Issue ID: {issue.issueId}</p>
            </div>
            <p className="mt-2 line-clamp-2">{issue.issue}</p>
            <div className="mt-2 flex items-center justify-end">
              <Button
                type="button"
                className="bg-orange-500 text-xs font-semibold text-white hover:bg-orange-600"
                onClick={() => {
                  setIssue(issue);
                  setIsIssueOpen(true);
                }}
              >
                Submit Response
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
  );
};
const SubmitResponse = ({ isOpen, setIsOpen, issue, getIssues }) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // id response is empty
    if (!response || response.length < 1) {
      return errorToast("Issue is required");
    }
    setLoading(true);
    await axios
      .post(`/admin/issues/${issue.issueId}`, { response })
      .then(async () => {
        await getIssues();
      })
      .then(() => {
        successToast("Issue submitted successfully");
        setIsOpen(false);
        setResponse("");
      })
      .catch((err) => {
        if (err?.response?.data.error) errorToast(err.response.data.error);
        else errorToast("Failed to submit response");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Response</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Submit your response to the issue raised by the user here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {/* issue */}
          <div className="mt-3">
            <p className="font-medium">Issue</p>
            <p className="text-sm text-gray-200">{issue?.issue}</p>
          </div>
          {/* response */}
          <div className="mt-3 grid gap-4">
            <Label
              htmlFor="response"
              className="flex items-center justify-between"
            >
              Response
              {/* letter count */}
              <span className="text-sm text-gray-300">
                {response?.length || 0}/1000
              </span>
            </Label>
            <Textarea
              id="response"
              className=""
              value={response}
              maxLength={500}
              onChange={(e) => setResponse(e.target.value)}
              rows={8}
              placeholder="Write your response here"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit Response"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminIssueResponse;
