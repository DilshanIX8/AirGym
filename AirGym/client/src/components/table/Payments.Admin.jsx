/* eslint-disable react/prop-types */
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LuArrowUpDown, LuChevronsDown } from "react-icons/lu";
import { Button } from "../ui/button";
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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import axios from "axios";
import { useEffect, useState } from "react";
import { errorToast, successToast } from "../../utils/toastify";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const columns = [
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Coach
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const client = row.getValue("user");
      return (
        <div className={`capitalize`}>{`${client?.firstName ?? ""} ${
          client?.lastName ?? ""
        }`}</div>
      );
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
    cell: ({ row }) => <div className="">{`${row.original.user.email}`}</div>,
  },
  {
    accessorKey: "phone",
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
    cell: ({ row }) => (
      <div className="">{`${row.original.user.phoneNumber}`}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount (LKR)
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const payment = row.original.availableForWithdrawal;
      return <div className={`capitalize`}>{payment}</div>;
    },
  },
];

const WithdrawFunds = ({ getCoaches }) => {
  const [loading, setLoading] = useState(false);
  const withdrawFunds = async () => {
    setLoading(true);
    await axios
      .post("/admin/withdraw-funds")
      .then(() => {
        getCoaches();
        successToast("Funds withdrawn successfully");
      })
      .catch(() => {
        errorToast("Failed to withdraw funds");
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
          This action cannot be undone. This will withdraw the available funds
          to the coach.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="text-gray-400 hover:text-gray-500">
          Close
        </AlertDialogCancel>
        <Button
          onClick={withdrawFunds}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          {loading ? "Withdrawing..." : "Withdraw"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

const AdminPaymentsTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [isProgress, setIsProgress] = useState(false);

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
  });

  const downloadPDF = async () => {
    setIsProgress(true);
    await axios
      .get("/admin/withdrawal-available-coaches/pdf", {
        responseType: "blob",
      })
      .then(async (res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${new Date().getTime()}_withdrawal_available_coaches.pdf`,
        );
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        errorToast("Failed to download PDF");
        console.log(error);
      })
      .finally(() => {
        setIsProgress(false);
      });
  };

  const getCoaches = async () => {
    axios
      .get("/admin/withdrawal-available-coaches")
      .then(({ data }) => {
        setData(data?.coaches);
      })
      .catch(() => {
        errorToast("Failed to get coaches");
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
        table.getColumn("phone")?.toggleVisibility(false);
      } else {
        table.getColumn("email")?.toggleVisibility(true);
        table.getColumn("phone")?.toggleVisibility(true);
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
      <p className="text-sm capitalize text-gray-300">
        Available Payments for Coaches
      </p>
      {/* search and column selection */}
      <div className="flex flex-col items-center gap-3 pb-4 sm:flex-row sm:justify-end">
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
        {/* download as pdf button */}
        <Button className="hidden !ring-0 sm:flex" onClick={downloadPDF}>
          {isProgress ? "Downloading..." : "Download as PDF"}
        </Button>
        {/* withdraw funds */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-32 bg-green-600 text-white !outline-none !ring-0 hover:bg-green-700">
              Withdraw Funds
            </Button>
          </AlertDialogTrigger>
          <WithdrawFunds getCoaches={getCoaches} />
        </AlertDialog>
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
                      className={`${index !== 0 ? "text-end" : ""}`}
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
                      className={`${index !== 0 ? "text-end" : ""}`}
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
export default AdminPaymentsTable;
