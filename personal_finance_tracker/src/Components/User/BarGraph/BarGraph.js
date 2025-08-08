import { useEffect } from "react";
import { getAverageExpenseApi, getAverageIncomeApi, getCurrentBalanceApi, getTotalExpenseApi, getTotalIncomeApi } from "../../../service/allApi";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { setBargraph, setLoading } from "./BarGraph.slice";

function BarGraph({ uid }) {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.bargraph);

  const getuserTransaction = async () => {
    try {
      dispatch(setLoading(true));
      const token = localStorage.getItem("token");
      const reqHeader = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [incomeRes, expenseRes, balanceRes, avgIncRes, avgExpRes] =
        await Promise.all([
          getTotalIncomeApi(uid, reqHeader),
          getTotalExpenseApi(uid, reqHeader),
          getCurrentBalanceApi(uid, reqHeader),
          getAverageIncomeApi(uid, reqHeader),
          getAverageExpenseApi(uid, reqHeader),
        ]);

      const graphData = [
        { name: "Total Income", value: incomeRes.data?.data || 0 },
        { name: "Total Expense", value: expenseRes.data?.data || 0 },
        { name: "Balance", value: balanceRes.data?.message || 0 },
        { name: "Avg Income", value: avgIncRes.data?.message || 0 },
        { name: "Avg Expense", value: avgExpRes.data?.message || 0 },
      ];

      dispatch(setBargraph(graphData));
    } catch (err) {
      console.error("Failed to fetch data:", err);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getuserTransaction();
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h5 className="text-center">Overview</h5>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : data.length > 0 ? (
        <ResponsiveContainer>
          <BarChart data={data} barSize={50}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4e73df" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center">No data found</p>
      )}
    </div>
  )
}
export default BarGraph