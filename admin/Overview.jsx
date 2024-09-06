import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Dashboard.scss";
import Notification from "./Notification";
import moment from "moment";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import html2canvas from "html2canvas";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const generateInitialsImage = (
  name,
  backgroundColor = "#007bff",
  textColor = "#ffffff",
  size = 100
) => {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, size, size);
  context.fillStyle = textColor;
  context.font = `${size * 0.5}px Arial`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(initials, size / 2, size / 2);
  return canvas.toDataURL();
};

const getFormattedDate = () => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("en-US", options);
};

const Dashboard = () => {
  const adminName = "Chalitha Amaranath";
  const adminImageURL = generateInitialsImage(adminName);
  const todayDate = getFormattedDate();
  const [currentTime, setCurrentTime] = useState(moment().format("h:mm:ss A"));
  const [orderData, setOrderData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartDatas, setChartData] = useState([]);
  const [totalWeeklyRevenue, setTotalWeeklyRevenue] = useState(0);
  const [totalWeeklyOrders, setTotalWeeklyOrders] = useState(0);

  const ordersChartRef = useRef(null);
  const salesChartRef = useRef(null);
  const ordersButtonRef = useRef(null);
  const salesButtonRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("h:mm:ss A"));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchWeeklyOrderData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/orders`);
        const orders = response.data.orders;
        const endDate = new Date();
        const startDate = moment(endDate).subtract(7, "days").toDate();
        const filteredOrders = orders.filter((order) => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startDate && orderDate <= endDate;
        });
        const dailyCounts = filteredOrders.reduce((acc, order) => {
          const dateKey = moment(order.orderDate).format("YYYY-MM-DD");
          if (!acc[dateKey]) {
            acc[dateKey] = 0;
          }
          acc[dateKey]++;
          return acc;
        }, {});
        const newChartData = Object.keys(dailyCounts).map((date) => ({
          date: date,
          orders: dailyCounts[date],
        }));
        setChartData(newChartData);

        // Calculate total weekly orders
        const totalOrders = newChartData.reduce(
          (sum, day) => sum + day.orders,
          0
        );
        setTotalWeeklyOrders(totalOrders);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching weekly order data:", error);
        setLoading(false);
      }
    };
    fetchWeeklyOrderData();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders`);
        const ordersData = response.data.orders;
        if (ordersData && Array.isArray(ordersData)) {
          const dailyData = ordersData.reduce((acc, order) => {
            const date = moment(order.orderDate).format("YYYY-MM-DD");
            if (!acc[date]) {
              acc[date] = { totalSales: 0, orderCount: 0 };
            }
            acc[date].totalSales += order.price * order.quantity;
            acc[date].orderCount += 1;
            return acc;
          }, {});
          const chartData = Object.keys(dailyData).map((date) => ({
            date,
            totalSales: dailyData[date].totalSales,
            orders: dailyData[date].orderCount,
          }));
          setSalesData(chartData);

          // Calculate total weekly revenue
          const totalRevenue = chartData.reduce(
            (sum, day) => sum + day.totalSales,
            0
          );
          setTotalWeeklyRevenue(totalRevenue);
        } else {
          console.error("Invalid order data:", ordersData);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchSalesData();
  }, []);

  const generatePDF = async (data, title, filename, chartRef, buttonRef) => {
    // Hide the button before taking the screenshot
    buttonRef.current.style.display = "none";

    // Wait for the next render to ensure the button is hidden
    await new Promise((resolve) => setTimeout(resolve, 0));

    const doc = new jsPDF();
    doc.text(title, 20, 10);

    // Add table
    doc.autoTable({
      head: [Object.keys(data[0])],
      body: data.map((row) => Object.values(row)),
    });

    // Add chart image
    const chartElement = chartRef.current;
    const canvas = await html2canvas(chartElement);
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(
      imgData,
      "PNG",
      15,
      doc.autoTable.previous.finalY + 15,
      180,
      100
    );

    // Restore the button visibility
    buttonRef.current.style.display = "block";

    doc.save(filename);
  };

  const handleGenerateOrdersReport = () => {
    generatePDF(
      chartDatas,
      "Weekly Orders Report",
      "orders_report.pdf",
      ordersChartRef,
      ordersButtonRef
    );
  };

  const handleGenerateSalesReport = () => {
    generatePDF(
      salesData,
      "Sales Report",
      "sales_report.pdf",
      salesChartRef,
      salesButtonRef
    );
  };

  return (
    <div className="mainContainer">
      <Notification />
      <div className="dashbordsec1">
        <div className="welcomeAdmin">
          <div className="adminImage">
            <img src={adminImageURL} alt="Admin" />
          </div>
          <div className="adminDetails">
            <p className="p1">Welcome, {adminName}</p>
            <p className="p2">Today is {todayDate}</p>
          </div>
        </div>
        <div className="timenow">{currentTime}</div>
      </div>
      <div className="chartsdiv">
        <div className="chart1" ref={ordersChartRef}>
          <p>Orders Visualization</p>
          {loading ? (
            <p>Loading Orders data...</p>
          ) : (
            <>
              <BarChart width={500} height={300} data={chartDatas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" />
              </BarChart>
              <p>Weekly Total Orders = {totalWeeklyOrders}</p>
            </>
          )}
          <button ref={ordersButtonRef} onClick={handleGenerateOrdersReport}>
            Generate Report
          </button>
        </div>
        <div className="chart2" ref={salesChartRef}>
          <p>Sales Visualization</p>
          {loading ? (
            <p>Loading Sales data...</p>
          ) : (
            <>
              <BarChart width={500} height={300} data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSales" fill="#82ca9d" />
              </BarChart>
              <p>Weekly Revenue = Rs: {totalWeeklyRevenue.toFixed(2)}</p>
            </>
          )}
          <button ref={salesButtonRef} onClick={handleGenerateSalesReport}>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
