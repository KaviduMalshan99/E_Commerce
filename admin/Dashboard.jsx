import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.scss';
import moment from 'moment';
import Widget from './Widget';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import AuthAPI from '../src/api/AuthAPI';

const Dashboard = () => {
    const adminName = 'EVO TRENDS';
    const todayDate = moment().format('dddd, MMMM Do YYYY');
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [todayRevenue, setTodayRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await AuthAPI.fetchCustomers();
                setUserCount(response.data.customers.length);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
    
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/orders`);
                const ordersData = response.data.orders;

                if (ordersData && Array.isArray(ordersData)) {
                    // Update total number of orders
                    setTotalOrders(ordersData.length);
                    setLoading(false);

                    // Get today's date in the desired format
                    const today = new Date().toLocaleDateString('en-US');

                    // Filter orders based on today's date
                    const todayOrders = ordersData.filter(order => 
                        new Date(order.orderDate).toLocaleDateString('en-US') === today
                    );

                    // Set the number of today's orders
                    setOrderCount(todayOrders.length);

                    // Calculate today's revenue based on the total field of the orders
                    const revenue = todayOrders.reduce((total, order) => total + order.total, 0);
                    setTodayRevenue(revenue);

                    // Calculate weekly order data for charting
                    const startDate = moment(new Date()).subtract(7, 'days').toDate();
                    const filteredOrders = ordersData.filter(order => new Date(order.orderDate) >= startDate);

                    // Count the number of orders for each day in the past week
                    const orderCounts = {};
                    filteredOrders.forEach(order => {
                        const orderDate = moment(order.orderDate).format('YYYY-MM-DD');
                        orderCounts[orderDate] = (orderCounts[orderDate] || 0) + 1;
                    });

                    // Convert the orderCounts object into an array for the chart
                    const chartData = Object.keys(orderCounts).map(date => ({
                        date,
                        orders: orderCounts[date]
                    }));

                    // Set the data for the chart
                    setChartData(chartData);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);
  
    return (
        <div className="dashboard">
            <h1>Welcome, {adminName}</h1>
            <p>{todayDate}</p>

            {/* Widgets Section */}
            <div className="widgets">
                <Widget title="Total Customers" value={userCount} icon="customers" />
                <Widget title="Orders Today" value={orderCount} icon="orders" />
                <Widget title="Revenue Today" value={`$${todayRevenue}`} icon="revenue" />
                <Widget title="Total Orders" value={totalOrders} icon="totalOrders" />
            </div>

            {/* Charts Section */}
            <div className="charts">
                <h3>Orders Over the Last Week</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
