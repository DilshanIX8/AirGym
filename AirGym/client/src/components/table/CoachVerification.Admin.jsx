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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
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
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const RejectCoach = ({ coachId, getCoaches, setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .post(`/admin/coach-rejections/${coachId}`, { reason: reason })
      .then(async () => {
        await getCoaches();
      })
      .then(() => {
        successToast("Coach rejected successfully");
        // clear the reason
        setReason("");
        // close the dialog
        setIsOpen(false);
      })
      .catch((err) => {
        if (err?.response?.data.error) errorToast(err.response.data.error);
        else errorToast("Failed to reject coach");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will reject the coach account.
        </AlertDialogDescription>
        {/* reason */}
        <div className="mt-3 grid gap-4">
          <Label htmlFor="reason" className="flex items-center justify-between">
            Reason
            {/* letter count */}
            <span className="text-sm text-gray-300">{reason.length}/500</span>
          </Label>
          <Textarea
            id="reason"
            className=""
            value={reason}
            maxLength={500}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Please provide a reason for rejecting the coach"
          />
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="text-gray-400 hover:text-gray-500">
          Close
        </AlertDialogCancel>
        <Button
          onClick={handleSubmit}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          {loading ? "Rejecting..." : "Reject Coach"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

const ApproveCoach = ({ coachId, getCoaches, setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .post(`/admin/coach-approvals/${coachId}`)
      .then(async () => {
        await getCoaches();
      })
      .then(() => {
        successToast("Coach approved successfully");
        // close the dialog
        setIsOpen(false);
      })
      .catch((err) => {
        if (err?.response?.data.error) errorToast(err.response.data.error);
        else errorToast("Failed to approve coach");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will approve the coach account.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="text-gray-400 hover:text-gray-500">
          Close
        </AlertDialogCancel>
        <Button
          onClick={handleSubmit}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          {loading ? "Approving..." : "Approve Coach"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

const MoreDetails = ({ coach, isOpen, setIsOpen, getCoaches }) => {
  const convertTime = (startTime, endTime) => {
    const start = startTime < 12 ? `${startTime} AM` : `${startTime - 12} PM`;
    const end = endTime + 1 < 12 ? `${endTime + 1} AM` : `${endTime - 11} PM`;
    return `${start} - ${end}`;
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[80%] overflow-y-auto md:max-w-5xl">
        <DialogHeader>
          <DialogTitle>More Details</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Coach Verification details of {coach?.user?.firstName}{" "}
            {coach?.user?.lastName}
          </DialogDescription>
        </DialogHeader>
        {/* coach details */}
        <div className="flex w-full flex-col gap-1 pt-4 md:flex-row">
          <div className="flex w-full flex-col gap-1 pt-4">
            {/* user details */}
            <div className="mt-3 text-base font-medium text-orange-400">
              User Details
            </div>
            {/* name */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">User :</span>
              <span>
                {coach?.user?.firstName} {coach?.user?.lastName}
              </span>
              <Link
                to={`/user/${coach?.user?.username}`}
                target="_black"
                rel="noreferrer"
              >
                <RiShareForwardFill className="-ms-2 -mt-1 h-6 w-6 text-green-400" />
              </Link>
            </div>
            {/* email */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Email :</span>
              <span>{coach?.user?.email}</span>
            </div>
            {/* phone */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Phone :</span>
              <span>{coach?.user?.phoneNumber}</span>
            </div>
            {/* birthday */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Birthday :</span>
              <span>{new Date(coach?.birthday).toDateString()}</span>
            </div>
            {/* address */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Address :</span>
              <span>{coach?.address}</span>
            </div>
            {/* id number */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">ID Number :</span>
              <span>{coach?.idNumber}</span>
            </div>
            {/* session fee */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Session Fee :</span>
              <span>LKR {coach?.oneSessionFee}</span>
            </div>
            {/* time duration */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Time Duration :</span>
              <span>
                {convertTime(coach?.startTimeSlot, coach?.endTimeSlot)}
              </span>
            </div>
            {/* experience */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Experience :</span>
              <span className="capitalize">
                {coach?.experience.replaceAll("_", " ").toLowerCase()}
              </span>
            </div>
            {/* description */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Description :</span>
              <span>{coach?.description}</span>
            </div>

            {/* coach details */}
            <div className="mt-3 text-base font-medium text-orange-400">
              Payment Details
            </div>
            {/* account holder name */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Account Holder :</span>
              <span>{coach?.paymentAccount?.accountHolderName}</span>
            </div>
            {/* account number */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Account Number :</span>
              <span>{coach?.paymentAccount?.accountNumber}</span>
            </div>
            {/* bank */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Bank :</span>
              <span>{coach?.paymentAccount?.nameOfBank}</span>
            </div>
            {/* branch */}
            <div className="flex items-start gap-x-3 text-sm font-medium">
              <span className="text-gray-300">Branch :</span>
              <span>{coach?.paymentAccount?.branch}</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 pt-4">
            {/* proofs */}
            <div className="mt-3 text-base font-medium text-orange-400">
              Proofs
            </div>
            {/* id front image */}
            <div className="flex flex-col items-start gap-y-2 text-sm font-medium">
              <span className="text-gray-300">ID Front Image :</span>
              <img
                src={import.meta.env.VITE_APP_IMAGE_URL + coach?.idFrontImage}
                alt="ID Front Proof"
                className="h-72 w-auto"
              />
            </div>
            {/* id back image */}
            <div className="flex flex-col items-start gap-y-2 text-sm font-medium">
              <span className="text-gray-300">ID Back Image :</span>
              <img
                src={import.meta.env.VITE_APP_IMAGE_URL + coach?.idBackImage}
                alt="ID Back Proof"
                className="h-72 w-auto"
              />
            </div>
            {/* camera image */}
            <div className="flex flex-col items-start gap-y-2 text-sm font-medium">
              <span className="text-gray-300">Camera Image :</span>
              <img
                src={import.meta.env.VITE_APP_IMAGE_URL + coach?.cameraImage}
                alt="Camera Proof"
                className="h-72 w-auto"
              />
            </div>

            {/* certificate */}
            <div className="mt-3 text-base font-medium text-orange-400">
              Certificates
            </div>
            {/* certificate can be image or pdf */}
            {coach?.certificate?.map((c, index) => (
              <div
                key={index}
                className="flex flex-col items-start gap-y-2 text-sm font-medium"
              >
                <span className="text-gray-300">Certificate {index + 1} :</span>
                {c?.type === "image" ? (
                  <img
                    src={import.meta.env.VITE_APP_IMAGE_URL + c}
                    alt={`Certificate ${index + 1}`}
                    className="h-72 w-auto"
                  />
                ) : (
                  <embed
                    src={import.meta.env.VITE_APP_IMAGE_URL + c}
                    type="application/pdf"
                    className="h-80 w-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* buttons for approve and reject */}
        <div className="mt-4 flex justify-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-32 !outline-none !ring-0"
              >
                Reject
              </Button>
            </AlertDialogTrigger>
            <RejectCoach
              coachId={coach?.id}
              getCoaches={getCoaches}
              setIsOpen={setIsOpen}
            />
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-32 bg-green-600 text-white !outline-none !ring-0 hover:bg-green-700">
                Approve
              </Button>
            </AlertDialogTrigger>
            <ApproveCoach
              coachId={coach?.id}
              getCoaches={getCoaches}
              setIsOpen={setIsOpen}
            />
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const columns = [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const coach = row.original;
      return <div className={""}>{coach.user?.firstName}</div>;
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const coach = row.original;
      return <div className={""}>{coach.user?.lastName}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const coach = row.original;
      return <div className={""}>{coach.user?.email}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const coach = row.original;
      return <div className={""}>{coach.user?.phoneNumber}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row, table }) => {
      const coach = row.original;
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
              onClick={() =>
                navigator.clipboard.writeText(coach?.user?.username)
              }
            >
              Copy Username
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                table.options.meta.setSelectedRow(coach);
                table.options.meta.setOpenMoreDetails();
              }}
            >
              More Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const AdminCoachVerificationTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [open, setOpen] = useState({
    moreDetails: false,
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
      setSelectedRow: (row) => setSelectedRow(row),
    },
  });

  const getCoaches = async () => {
    axios
      .get("/admin/coach-approvals")
      .then((res) => {
        setData(res.data.coaches);
      })
      .catch((err) => {
        errorToast(err.message);
      });
  };

  useEffect(() => {
    getCoaches();
  }, []);

  // hide columns with screen width < 640px
  useEffect(() => {
    const resizeWindow = (size) => {
      if (size < 640) {
        table.getColumn("email")?.toggleVisibility(false);
        table.getColumn("phoneNumber")?.toggleVisibility(false);
      } else {
        table.getColumn("email")?.toggleVisibility(true);
        table.getColumn("phoneNumber")?.toggleVisibility(true);
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
        coach={selectedRow}
        isOpen={open.moreDetails}
        setIsOpen={() => setOpen({ ...open, moreDetails: false })}
        getCoaches={getCoaches}
      />

      {/* search and column selection */}
      <div className="flex flex-col items-center gap-3 pb-4 sm:flex-row sm:justify-between">
        <Input
          placeholder="Filter dates..."
          value={table.getColumn("firstName")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("firstName")?.setFilterValue(event.target.value)
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
export default AdminCoachVerificationTable;
