/* eslint-disable react/prop-types */
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { HiDotsVertical } from "react-icons/hi";
import { LuArrowUpDown, LuChevronsDown } from "react-icons/lu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import axios from "axios";
import { useEffect, useState } from "react";
import { errorToast, successToast } from "../../utils/toastify";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { TiStarFullOutline } from "react-icons/ti";
import { transferZodErrors } from "../../utils/transfer-zod-errors";
import { RiShareForwardFill } from "react-icons/ri";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const statusAndColors = [
  {
    status: "PENDING",
    color: "text-yellow-400",
  },
  {
    status: "RESERVED",
    color: "text-sky-400",
  },
  {
    status: "ACCEPTED",
    color: "text-green-400",
  },
  {
    status: "CANCELLED",
    color: "text-red-500",
  },
  {
    status: "FINISHED",
    color: "text-green-400",
  },
];

const MoreDetails = ({ session, isOpen, setIsOpen }) => {
  const convertTime = (time) => {
    const start = time < 12 ? `${time} AM` : `${time - 12} PM`;
    const end = time + 1 < 12 ? `${time + 1} AM` : `${time - 11} PM`;
    return `${start} - ${end}`;
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>More Details</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Session details for {new Date(session?.date).toDateString()} at{" "}
            {convertTime(session?.timeSlot)}
          </DialogDescription>
        </DialogHeader>
        {/* session details */}
        <div className="flex w-full flex-col gap-1 pt-4">
          {/* status */}
          <div className="flex items-start gap-x-3 text-sm font-medium">
            <span className="text-gray-300">Status :</span>
            <span
              className={`capitalize ${
                statusAndColors.find((item) => item.status === session?.status)
                  ?.color
              }`}
            >
              {session?.status.toLowerCase()}
            </span>
          </div>
          {/* link */}
          <div className="flex items-start gap-x-3 text-sm font-medium">
            <span className="w-full max-w-10 text-start text-gray-300">
              Link :
            </span>
            <span className="line-clamp-1 text-start">
              {session?.link ? (
                <Link
                  to={session?.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500"
                >
                  {session?.link}
                </Link>
              ) : (
                "No Link"
              )}
            </span>
          </div>
          {/* coach details */}
          <div className="mt-3 text-base font-medium text-orange-400">
            Coach Details
          </div>
          {/* name */}
          <div className="flex items-start gap-x-3 text-sm font-medium">
            <span className="text-gray-300">Coach :</span>
            <span>
              {session?.coach?.user?.firstName} {session?.coach?.user?.lastName}
            </span>
            <Link to={`/user/${session?.coach?.user?.username}`}>
              <RiShareForwardFill className="-ms-2 -mt-1 h-6 w-6 text-green-400" />
            </Link>
          </div>
          {/* coach email */}
          <div className="flex items-start gap-x-3 text-sm font-medium">
            <span className="text-gray-300">Email :</span>
            <span>{session?.coach?.user?.email}</span>
          </div>
          {/* coach phone */}
          <div className="flex items-start gap-x-3 text-sm font-medium">
            <span className="text-gray-300">Phone :</span>
            <span>{session?.coach?.user?.phoneNumber}</span>
          </div>

          {/* session details */}
          <div className="mt-3 text-base font-medium text-orange-400">
            Session Details
          </div>
          {/* session fee */}
          <div className="flex items-start gap-x-3 text-sm font-medium">
            <span className="text-gray-300">Fee :</span>
            <span>LKR. {session?.coach.oneSessionFee.toFixed(2)}</span>
          </div>
          {/* review for this session */}
          <div className="flex items-start gap-x-3 text-sm font-medium">
            <span className="text-gray-300">Review :</span>
            <span>
              {session?.review ? (
                session?.review
              ) : (
                <span className="text-gray-300">No review</span>
              )}
            </span>
          </div>
          {/* rating for this session */}
          <div className="flex items-start gap-x-3 text-sm font-medium">
            <span className="text-gray-300">Rating :</span>
            <span>
              {session?.rating ? (
                `${session?.rating} of 5 stars`
              ) : (
                <span className="text-gray-300">No rating</span>
              )}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FinishSession = ({ sessionId, isOpen, setIsOpen, getSessions }) => {
  const [rating, setRating] = useState({
    review: "",
    rating: 1,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .post(`/client/session/finish/${sessionId}`, rating)
      .then(async () => {
        await getSessions();
      })
      .then(() => {
        successToast("Session finished successfully");
        setIsOpen(false);
      })
      .catch((err) => {
        if (err?.response?.data.error) errorToast(err.response.data.error);
        else if (err?.response?.data.errors)
          setValidationErrors(
            transferZodErrors(err?.response?.data.errors).error,
          );
        else errorToast("Failed to finish the session");
      })
      .finally(() => {
        setLoading(false);
        setRating({
          review: "",
          rating: 1,
        });
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Finish Session</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Give a rating and review for the session you had with the coach.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {/* ratings stars */}
          <div className="grid gap-2 pt-4">
            <Label htmlFor="rating" className="text-start">
              Rating
            </Label>
            <div className="flex items-center gap-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  className={`${rating.rating >= star ? "!text-amber-500" : "text-gray-300 hover:text-amber-400"} !border-none !bg-transparent px-0 !outline-none !ring-0`}
                  onClick={() => setRating({ ...rating, rating: star })}
                >
                  <TiStarFullOutline className="h-5 w-5" />
                </Button>
              ))}

              <span className="text-sm font-medium">
                {rating.rating ? `${rating.rating} of 5 stars` : "No rating"}
              </span>
            </div>
          </div>
          {/* error message */}
          {validationErrors?.rating && (
            <p className="text-sm font-medium text-red-500">
              {validationErrors?.rating}
            </p>
          )}
          {/* review */}
          <div className="mt-3 grid gap-4">
            <Label
              htmlFor="review"
              className="flex items-center justify-between"
            >
              Review
              {/* letter count */}
              <span className="text-sm text-gray-300">
                {rating.review.length}/500
              </span>
            </Label>
            <Textarea
              id="review"
              className=""
              value={rating.review}
              maxLength={500}
              onChange={(e) => setRating({ ...rating, review: e.target.value })}
              rows={4}
              placeholder="Enter your feedback..."
            />
          </div>
          {/* error message */}
          {validationErrors?.review && (
            <p className="text-sm font-medium text-red-500">
              {validationErrors?.review}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={handleSubmit}
          >
            {loading ? "Finishing..." : "Finish Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CancelSession = ({ sessionId, isOpen, setIsOpen, getSessions }) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .delete(`/common/session/${sessionId}`)
      .then(async () => {
        await getSessions();
      })
      .then(() => {
        successToast("Session cancelled successfully");
        setIsOpen(false);
      })
      .catch((err) => {
        if (err?.response?.data.error) errorToast(err.response.data.error);
        else errorToast("Failed to cancel the session");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel the
            session.
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
            {loading ? "Canceling..." : "Cancel Session"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const columns = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className={`capitalize`}>
        {new Date(row.getValue("date")).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "timeSlot",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time Slot
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const time = Number(row.getValue("timeSlot"));
      const start = time < 12 ? `${time} AM` : `${time - 12} PM`;
      const end = time + 1 < 12 ? `${time + 1} AM` : `${time - 11} PM`;
      return (
        <div className={`capitalize`}>
          {start} - {end}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status");
      let color = "";
      statusAndColors.forEach((item) => {
        if (item.status === status) {
          color = item.color;
          return;
        }
      });
      return (
        <div className={`capitalize ${color}`}>
          {row.getValue("status").toLowerCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const link = row.getValue("link");
      const copyLink = (link) => {
        navigator.clipboard.writeText(link);
        successToast("Link copied to clipboard");
      };
      return (
        <div className={`capitalize`}>
          {link ? (
            <Button
              size="sm"
              className="h-7 bg-orange-500 px-2 text-xs font-medium text-white hover:bg-orange-600"
              onClick={() => copyLink(link)}
            >
              Copy Link
            </Button>
          ) : (
            "No Link"
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row, table }) => {
      const session = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative !ring-0">
              <HiDotsVertical className="h-4 w-4 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(session.id)}
            >
              Copy Session ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                table.options.meta.setSelectedRow(session);
                table.options.meta.setOpenMoreDetails();
              }}
            >
              More Details
            </DropdownMenuItem>
            {["ACCEPTED", "PENDING", "RESERVED"].includes(session.status) &&
              // date is in the tomorrow
              new Date(session.date).getDate() === new Date().getDate() + 1 && (
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => {
                    table.options.meta.setSelectedRow(session);
                    table.options.meta.setOpenCancelSession();
                  }}
                >
                  Cancel Session
                </DropdownMenuItem>
              )}
            {session.status === "ACCEPTED" &&
              // date is today or in the past and time is grate than current time
              (new Date(session.date) < new Date() ||
                (new Date(session.date) === new Date() &&
                  new Date().getHours() + 1 < session.timeSlot)) && (
                <DropdownMenuItem
                  className="text-green-500"
                  onClick={() => {
                    table.options.meta.setSelectedRow(session);
                    table.options.meta.setOpenFinishSession();
                  }}
                >
                  Finish Session
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const ClientAppointmentsTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [open, setOpen] = useState({
    moreDetails: false,
    finishSession: false,
    cancelSession: false,
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    meta: {
      openMoreDetails: open.moreDetails,
      setOpenMoreDetails: () =>
        setOpen({ ...open, moreDetails: !open.moreDetails }),
      openFinishSession: open.finishSession,
      setOpenFinishSession: () =>
        setOpen({ ...open, finishSession: !open.finishSession }),
      openCancelSession: open.cancelSession,
      setOpenCancelSession: () => setOpen({ ...open, cancelSession: true }),
      setSelectedRow: (row) => setSelectedRow(row),
    },
  });

  const getSessions = async () => {
    axios
      .get("/client/session")
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        errorToast("Failed to get sessions");
      });
  };

  useEffect(() => {
    getSessions();
  }, []);

  // hide columns with screen width < 640px
  useEffect(() => {
    const resizeWindow = (size) => {
      if (size < 640) {
        table.getColumn("timeSlot")?.toggleVisibility(false);
        table.getColumn("status")?.toggleVisibility(false);
      } else {
        table.getColumn("timeSlot")?.toggleVisibility(true);
        table.getColumn("status")?.toggleVisibility(true);
      }
    };
    // Function to update the state with the current window width
    const handleResize = () => {
      resizeWindow(window.innerWidth);
    };

    // Call the function to set the state with the initial window width
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, [table]);

  return (
    <div className="w-full xl:container">
      {/* more details dialog */}
      <MoreDetails
        session={selectedRow}
        isOpen={open.moreDetails}
        setIsOpen={() => setOpen({ ...open, moreDetails: false })}
      />
      {/* finish session dialog */}
      <FinishSession
        sessionId={selectedRow?.id}
        isOpen={open.finishSession}
        getSessions={getSessions}
        setIsOpen={() => setOpen({ ...open, finishSession: false })}
      />
      {/* cancel session dialog */}
      <CancelSession
        sessionId={selectedRow?.id}
        isOpen={open.cancelSession}
        getSessions={getSessions}
        setIsOpen={() => setOpen({ ...open, cancelSession: false })}
      />

      {/* search and column selection */}
      <div className="flex flex-col items-center gap-3 pb-4 sm:flex-row sm:justify-between">
        <Input
          placeholder="Filter dates..."
          value={table.getColumn("date")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("date")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden !ring-0 sm:flex">
              Columns <LuChevronsDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="hidden sm:block">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* table */}
      <div className="rounded-md border border-slate-600">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`${index === headerGroup.headers.length - 1 ? "text-end" : ""}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={`${index === row.getVisibleCells().length - 1 ? "flex justify-end" : ""}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getPaginationRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) show.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ClientAppointmentsTable;
