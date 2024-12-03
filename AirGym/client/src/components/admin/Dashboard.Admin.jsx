/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { errorToast } from "../../utils/toastify";
import axios from "axios";
import MonthChart from "../ui/month-chart";

const chartConfigSessions = {
  views: {
    label: "Daily Sessions",
  },
  sessions: {
    label: "Sessions",
    color: "hsl(var(--chart-2))",
  },
};

const chartConfigIncome = {
  views: {
    label: "Daily Income",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-3))",
  },
};

const chartConfigUsers = {
  views: {
    label: "Daily Registrations",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-4))",
  },
};

const AdminStatistics = () => {
  const [data, setData] = useState(null);

  const getStatistics = useCallback(async () => {
    await axios
      .get(`/admin/statistics`)
      .then(({ data }) => {
        setData(data);
      })
      .catch(() => {
        errorToast("Failed to get statistics");
      });
  }, []);

  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  return (
    <div className="w-full xl:container">
      {/* top statistics */}
      <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:flex-row">
        {/* total sessions */}
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-800 p-4 shadow-md">
          <h3 className="text-xl font-medium">
            Total Sessions{" "}
            <span className="text-sm font-light">(Last 30 days)</span>
          </h3>
          <p className="text-3xl font-medium">{data?.totalSessions || 0}</p>
        </div>
        {/* total income */}
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-800 p-4 shadow-md">
          <h3 className="text-xl font-medium">
            Total Income{" "}
            <span className="text-sm font-light">(Last 30 days)</span>
          </h3>
          <p className="text-3xl font-medium">
            LKR {data?.totalIncome?._sum?.fee || 0}
          </p>
        </div>
        {/* total new users */}
        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-800 p-4 shadow-md">
          <h3 className="text-xl font-medium">
            New Users <span className="text-sm font-light">(Last 30 days)</span>
          </h3>
          <p className="text-3xl font-medium">{data?.newUsers || 0}</p>
        </div>
      </div>
      {/* month chart */}
      {data && (
        <div className="mt-8 flex flex-col gap-y-8">
          <MonthChart
            chartConfig={chartConfigSessions}
            chartData={data.dataByDate}
            type="sessions"
            title="Daily Sessions"
            description="Showing total sessions for the last 30 days"
          />

          <MonthChart
            chartConfig={chartConfigIncome}
            chartData={data.dataByDate}
            type="income"
            title="Daily Income"
            description="Showing total income for the last 30 days"
          />

          <MonthChart
            chartConfig={chartConfigUsers}
            chartData={data.dataByDate}
            type="users"
            title="Daily Registrations"
            description="Showing total registrations for the last 30 days"
          />
        </div>
      )}
    </div>
  );
};

export default AdminStatistics;
