import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SellerDashboard() {
  const sellerId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not seller
  useEffect(() => {
    if (!token) navigate("/");
    if (role !== "seller") navigate("/");
  }, [token, role, navigate]);

  // Fetch Seller Statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/book/seller/stats/${sellerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("GET /book/seller/stats response:", res.data);
        setChartData(res.data.result || []);
      } catch (err) {
        console.log("Stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!token || !sellerId) {
      setLoading(false);
      return;
    }

    fetchStats();
  }, [sellerId, token]);

  if (loading) {
    return <h2 className="text-center mt-5">Loading Dashboard...</h2>;
  }

  // Summary Values
  const totalBooks = chartData.length;
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);

  const data = {
    labels: ["Books Added", "Orders Received"],
    datasets: [
      {
        label: "Seller Statistics",
        data: [totalBooks, totalOrders],
        backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(255, 193, 7, 0.8)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 193, 7, 1)"],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Books & Orders Overview"
      }
    }
  };

  return (
    <div className="container mt-5 text-center">

      {/* TOP SUMMARY CARDS */}
      <div className="row mb-4 justify-content-center" style={{marginTop:"120px"}}>

        <h3 className="dashboard-title mb-3">Seller Dashboard</h3>

        <div className="col-md-3">
          <div className="card shadow-sm p-3" style={{ borderLeft: "5px solid #007bff"}}> 
            <h5>Total Books Added</h5>
            <h2 className="text-primary">{totalBooks}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3" style={{ borderLeft: "5px solid #ffc107" }}>
            <h5>Total Orders Received</h5>
            <h2 className="text-warning">{totalOrders}</h2>
          </div>
        </div>

      </div>

      {/* CHART */}
      <div style={{ width: "100%", maxWidth: "850px", margin: "0 auto" }}>
        <Bar data={data} options={options} />
      </div>

    </div>
  );
}

export default SellerDashboard;
