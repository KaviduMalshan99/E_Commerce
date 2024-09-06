import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.scss";
import Notification from "./Notification";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AuthAPI from "../src/api/AuthAPI";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const generateInitialsImage = (
  name,
  backgroundColor = "#007bff",
  textColor = "#ffffff",
  size = 100
) => {
  // Extract initials from the name
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  // Create a canvas element
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  // Draw background
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, size, size);

  // Draw text
  context.fillStyle = textColor;
  context.font = `${size * 0.5}px Arial`; // Adjust font size as needed
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(initials, size / 2, size / 2);

  // Convert canvas to data URL
  const dataURL = canvas.toDataURL();

  return dataURL;
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartDatas, setChartData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AuthAPI.fetchCustomers(); // Corrected to call the function
        setUserCount(response.data.customers.length); // Assuming response.data.customers is an array
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders`);
        console.log("Orders API Response:", response.data); // Log the response data
        const ordersData = response.data.orders; // Correctly access the 'orders' property

        if (ordersData && Array.isArray(ordersData)) {
          setTotalOrders(ordersData.length); // Update the totalOrders state with the count of all orders
          setLoading(false);
          // Filter orders based on today's date
          const today = new Date().toLocaleDateString("en-US");
          const todayOrders = ordersData.filter((order) => {
            const orderDate = new Date(order.orderDate).toLocaleDateString(
              "en-US"
            );
            return orderDate === today;
          });
          setOrderCount(todayOrders.length);

          // Calculate today's revenue
          const revenue = todayOrders.reduce(
            (total, order) => total + order.price * order.quantity,
            0
          );
          setTodayRevenue(revenue);
        } else {
          console.error("Invalid response data for orders:", ordersData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // State to store conversion rates
  const [conversionRates, setConversionRates] = useState({
    USD: 1.0,
    LKR: 0,
    INR: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders`);
        const ordersData = response.data.orders; // Ensure this is the correct path

        if (ordersData && Array.isArray(ordersData)) {
          const today = new Date().toLocaleDateString("en-US");
          const todayOrders = ordersData.filter(
            (order) =>
              new Date(order.orderDate).toLocaleDateString("en-US") === today
          );

          const todayRevenue = todayOrders.reduce(
            (total, order) => total + order.price * order.quantity,
            0
          );

          setOrderCount(todayOrders.length);
          setTotalOrders(ordersData.length);
          setTodayRevenue(todayRevenue);
          setOrderData(orderData);
        } else {
          console.error("Orders data is not an array:", ordersData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders for the past week
  const today = new Date();
  const startDate = moment(today).subtract(7, "days").toDate();
  const filteredOrders = orderData.filter(
    (order) => new Date(order.orderDate) >= startDate
  );

  // Count orders for each day of the past week
  const orderCounts = {};
  filteredOrders.forEach((order) => {
    const orderDate = moment(order.orderDate).format("YYYY-MM-DD");
    orderCounts[orderDate] = (orderCounts[orderDate] || 0) + 1;
  });

  // Convert orderCounts object to an array of objects for Recharts
  const chartData = Object.keys(orderCounts).map((date) => ({
    date,
    orders: orderCounts[date],
  }));

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders`); // Assuming this endpoint gives you the order data
        console.log("Orders API Response:", response.data); // Log the whole response to verify the structure

        const ordersData = response.data.orders;
        if (ordersData && Array.isArray(ordersData)) {
          const dailyData = ordersData.reduce((acc, order) => {
            // Simplify the date to YYYY-MM-DD format for daily aggregation
            const date = moment(order.orderDate).format("YYYY-MM-DD");
            if (!acc[date]) {
              acc[date] = { totalSales: 0, orderCount: 0 };
            }
            // Assuming 'price' and 'quantity' are relevant for calculating total sales
            acc[date].totalSales += order.price * order.quantity;
            acc[date].orderCount += 1;
            return acc;
          }, {});

          // Convert the aggregated object into an array for charting
          const chartData = Object.keys(dailyData).map((date) => ({
            date,
            totalSales: dailyData[date].totalSales,
            orders: dailyData[date].orderCount,
          }));

          setSalesData(chartData);
        } else {
          console.error("Invalid order data:", ordersData);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchSalesData();
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }
        const data = await response.json();
        const { LKR, INR } = data.rates;
        setConversionRates({ USD: 1.0, LKR, INR });
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weekly order data:", error);
        setLoading(false);
      }
    };

    fetchWeeklyOrderData();
  }, []);

  return (
    <div className="mainContainer">
      <Notification />

      <div className="dashbordsec1">
        <div className="weldiv1">
          <div className="welcomeAdmin">
            <div className="adminImage">
              <img src={adminImageURL} alt="Admin" />
            </div>

            <div className="adminDetails">
              <p className="p1">Welcome, {adminName}</p>
              <p className="p2">Today is {todayDate}</p>
            </div>
          </div>

          <div className="conversionRates">
            <h2>Conversion Rate For Today</h2>
            <ul>
              <div>
                <li className="pp1">USD </li>
                <li className="pp2">{conversionRates.USD}</li>
              </div>

              <div>
                <li className="pp1">LKR </li>
                <li className="pp2">{conversionRates.LKR}</li>
              </div>

              <div>
                <li className="pp1">INR </li>
                <li className="pp2">{conversionRates.INR}</li>
              </div>
            </ul>
          </div>
        </div>

        <div className="weldiv1">
          <div className="weldivsec1">
            <div className="ordercount">
              <i className="fas fa-tachometer-alt" />
              <h6>Today Orders: </h6>
              <p className="welp">{orderCount}</p>
            </div>

            <div className="totalorders">
              <i className="fas fa-shopping-cart" />
              <h6>Total Orders: </h6>
              <p className="welp">{totalOrders}</p>
            </div>
          </div>

          <div className="weldiv2">
            <div className="usercount">
              <i className="fas fa-users" />
              <h6>Total Users: </h6>
              <p className="welp">{userCount}</p>
            </div>

            <div className="Todayrevenue">
              <i className="fas fa-dollar-sign" />
              <h6>Daily Revenue : </h6>
              <p className="welp"> LKR.{todayRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="calendertime">
          <div className="timenow">{currentTime}</div>
          <div className="calendertoday">
            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>
        </div>
      </div>

      <div className="chartsdiv">
        <div className="chart1">
          <p>Orders Visualization</p>
          {loading ? (
            <p>Loading chart data...</p>
          ) : (
            <LineChart width={450} height={300} data={chartDatas}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" />
            </LineChart>
          )}
        </div>

        <div className="chart2">
          <p>Sales Visualization</p>
          <AreaChart width={480} height={300} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Assuming categories are dynamically generated */}
            {Object.keys(salesData[0] || {}).map((category, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={category}
                stackId="1"
                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              />
            ))}
          </AreaChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
