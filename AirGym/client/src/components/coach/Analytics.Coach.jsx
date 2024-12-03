/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { errorToast } from "../../utils/toastify";
import { ChartContainer } from "../ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FaHistory, FaInfoCircle } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Link, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import AnalyticsHistoryTable from "../table/AnalyticsHistory.Common";

const keys = [
  "biceps",
  "calf",
  "chest",
  "forearm",
  "height",
  "hip",
  "neck",
  "shoulders",
  "weight",
  "waist",
  "thigh",
];

const chartConfig = {
  current: {
    label: "Current",
  },
  initial: {
    label: "Initial",
  },
};

const CoachAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [is404, setIs404] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);
  const [activeHistory, setActiveHistory] = useState("shoulders");
  const { client } = useParams();

  const fetchData = useCallback(async () => {
    if (!client) {
      setIs404(true);
      return;
    }
    setLoading(true);
    await axios
      .get(`/coach/analytics/${client}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          errorToast("You do not have permission to view this data.");
          setIsForbidden(true);
        } else {
          errorToast(error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [client]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // check if user is not found
  if (is404)
    return (
      <div className="flex h-[calc(100vh_-_8rem)] flex-col">
        {/* flex grow */}
        <div className="mt-24 flex flex-grow flex-col" />

        <div className="flex min-h-96 flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-100">
            404 - Page Not Found
          </h1>
          <Link
            to="/"
            className="mt-4 rounded-md bg-orange-600 px-3 py-2 text-orange-100 hover:bg-orange-700"
          >
            Go back to home
          </Link>
        </div>

        {/* flex grow */}
        <div className="flex flex-grow flex-col" />
      </div>
    );

  // check if user is forbidden
  if (isForbidden)
    return (
      <div className="flex h-[calc(100vh_-_8rem)] flex-col">
        {/* flex grow */}
        <div className="mt-24 flex flex-grow flex-col" />

        <div className="flex min-h-96 flex-col items-center justify-center">
          <h1 className="">You are not authorized to access this page.</h1>
          <Link
            to="/"
            className="mt-4 rounded-md bg-orange-600 px-3 py-2 text-orange-100 hover:bg-orange-700"
          >
            Go back to home
          </Link>
        </div>
        {/* flex grow */}
        <div className="flex flex-grow flex-col" />
      </div>
    );

  return (
    <div className="w-full xl:container">
      <h1 className="flex items-center justify-center gap-x-1 pb-5 text-center text-base font-semibold text-orange-100 sm:text-xl lg:text-2xl xl:pb-8">
        Client Analytics{" "}
        <FaInfoCircle
          onClick={() => setIsOpen(true)}
          className="cursor-pointer text-xl text-orange-400"
        />
      </h1>
      {/* about */}
      <AboutAlert isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* dialog for individual analytics */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-h-[80%] w-full max-w-[95%] xl:max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              Records History of{" "}
              <span className="capitalize">{activeHistory}</span>
            </DialogTitle>
            <DialogDescription className="text-xs font-medium">
              This is the history of the client&apos;s measurements
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <AnalyticsHistoryTable
              role={"coach"}
              type={activeHistory}
              username={client}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* analytics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* loading */}
        {loading && (
          <div className="col-span-4 flex w-full justify-center">Loading..</div>
        )}
        {data &&
          !loading &&
          keys.map((key) => (
            <div
              key={key}
              className="rounded-md border border-slate-700 bg-white/5 p-4 text-center shadow-md"
            >
              <h2 className="text-xl font-medium capitalize text-orange-500 md:text-2xl">
                {key}
              </h2>
              <div className="flex justify-center">
                <Tabs defaultValue="initial" className="w-full max-w-[400px]">
                  <TabsContent value="initial">
                    <RadialChart
                      chartData={[{ initial: Number(data[key]?.initial) || 0 }]}
                      accessKey={"initial"}
                    />
                  </TabsContent>
                  <TabsContent value="current">
                    <RadialChart
                      chartData={[{ current: Number(data[key]?.current) || 0 }]}
                      accessKey={"current"}
                    />
                  </TabsContent>
                  <TabsList className="mt-3 flex gap-x-2 bg-transparent">
                    <TabsTrigger
                      value="initial"
                      className="w-24 rounded-sm bg-slate-800 aria-selected:!bg-orange-600"
                    >
                      Initial
                    </TabsTrigger>
                    <TabsTrigger
                      value="current"
                      className="w-24 rounded-sm bg-slate-800 aria-selected:!bg-orange-600"
                    >
                      Current
                    </TabsTrigger>
                    <button
                      className="text-orange-400"
                      onClick={() => {
                        setActiveHistory(key);
                        setIsHistoryOpen(true);
                      }}
                    >
                      <FaHistory />
                    </button>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const RadialChart = ({ chartData, accessKey }) => {
  const getEndAngle = () => {
    const percentage = chartData[0][accessKey];
    if (percentage > 100) return 360;
    if (percentage < 0) return 0;
    return percentage * 3.6;
  };
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[200px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={90 + getEndAngle() * -1}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-slate-700 last:fill-slate-900"
          polarRadius={[86, 74]}
        />
        <RadialBar
          dataKey={accessKey}
          background
          cornerRadius={10}
          className={`${chartData[0][accessKey] < 0 ? "fill-red-500" : "fill-green-500"}`}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className={`${chartData[0][accessKey] < 0 ? "fill-red-500" : "fill-green-500"} text-3xl font-semibold`}
                    >
                      {chartData[0][accessKey].toLocaleString()}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-slate-300 capitalize"
                    >
                      {chartConfig[accessKey].label}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
};

const AboutAlert = ({ isOpen, setIsOpen }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>About Client Analytics</AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            This is the analytics page where you can see your progress in
            different measurements. The percentage is calculated by comparing
            the measurements entered at the end with the measurements entered
          </AlertDialogDescription>

          <p className="pt-4 text-sm">
            <span className="font-semibold text-green-400">Current:</span> The
            percentage given by comparing the measurements entered at the end
            with the measurements entered now.
          </p>
          <p className="pb-5 pt-2 text-sm">
            <span className="font-semibold text-green-400">Initial:</span> The
            percentage is the percentage that is given by comparing the
            measurements that are entered now with the measurements that were
            very first entered on this platform.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-gray-400 hover:text-gray-500">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CoachAnalytics;
