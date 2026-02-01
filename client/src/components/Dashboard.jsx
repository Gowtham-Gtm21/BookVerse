import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalBooks: 0,
    totalOrders: 0,
  });

  const getStats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.log("Error loading dashboard data", err);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  if (!token) navigate("/");

  const userPieData = {
    labels: ["Users", "Sellers"],
    datasets: [
      {
        data: [stats.totalUsers, stats.totalSellers],
        backgroundColor: ["#4f46e5", "#16a34a"],
      },
    ],
  };

  const barData = {
    labels: ["Books", "Orders"],
    datasets: [
      {
        label: "Count",
        data: [stats.totalBooks, stats.totalOrders],
        backgroundColor: ["#f59e0b", "#ef4444"],
      },
    ],
  };

  if (token && role === "admin") {
    return (
      <div className="dash-page container">

        <h2 className="dash-title text-center">Admin Dashboard</h2>
        <p className="dash-subtitle text-center">Analyze and monitor platform activity</p>

        {/* Statistic Boxes */}
        <div className="row g-4 stats-row">

          <div className="col-md-3 col-6">
            <div className="stat-card border-blue">
              <h5>Total Users</h5>
              <h2>{stats.totalUsers}</h2>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="stat-card border-green">
              <h5>Total Sellers</h5>
              <h2>{stats.totalSellers}</h2>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="stat-card border-yellow">
              <h5>Total Books</h5>
              <h2>{stats.totalBooks}</h2>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="stat-card border-red">
              <h5>Total Orders</h5>
              <h2>{stats.totalOrders}</h2>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row mt-5 justify-content-center">
          
          <div className="col-md-5 col-12 mb-4">
            <div className="chart-box">
              <h5 className="text-center mb-3">Users vs Sellers</h5>
              <Pie data={userPieData} />
            </div>
          </div>

          <div className="col-md-6 col-12 mb-4">
            <div className="chart-box">
              <h5 className="text-center mb-3">Books & Orders Overview</h5>
              <Bar data={barData} />
            </div>
          </div>
        </div>

      </div>
    );
  }
};

export default Dashboard;
