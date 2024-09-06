// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, Link } from "react-router-dom";
// import "./OrdersTable.css";
// import emailjs from 'emailjs-com';

// const OrdersTable = () => {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrderIds, setSelectedOrderIds] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterBy, setFilterBy] = useState("orderId");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/api/orders");
//         console.log("Orders API Response:", response.data);
//         const ordersData = response.data.orders;
//         if (ordersData && Array.isArray(ordersData)) {
//           const formattedOrders = ordersData.map((order) => ({
//             orderId: order.orderId,
//             productId: order.id,
//             quantity: order.quantity,
//             location: order.country === "Sri Lanka" ? "Local" : "Foreign",
//             status: order.Status,
//             ContactStatus: order.ContactStatus || "Not Contacted",
//             canDispatch: false
//           }));
//           setOrders(formattedOrders);
//         } else {
//           console.error("Invalid response data for orders:", ordersData);
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterChange = (e) => {
//     setFilterBy(e.target.value);
//   };

//   const handleOrderSelect = (orderId) => {
//     setSelectedOrderIds((prevSelected) =>
//       prevSelected.includes(orderId)
//         ? prevSelected.filter((id) => id !== orderId)
//         : [...prevSelected, orderId]
//     );
//   };

//   const handleContactClick = async () => {
//     try {
//       // Use async map to allow each order to be updated individually
//       const updatedOrdersPromises = orders.map(async (order) => {
//         // Check if the order is in the selectedOrderIds list
//         if (selectedOrderIds.includes(order.orderId)) {
//           // Prepare email parameters
//           const emailTemplateParams = {
//             to_name: "Logistic Partner",
//             to_email: order.location === "Local" ? "eesara2002@gmail.com" : "thiyaradb@gmail.com",
//             order_id: order.orderId,
//             product_id: order.productId,
//             status: order.status
//           };

//           // Replace with your actual Service ID, Template ID, and User ID
//           const SERVICE_ID = "service_smyt8zd";
//           const TEMPLATE_ID = "template_iq0gdfg";
//           const USER_ID = "b_3EbwZJHsdFLGsRI";

//           // Send email notification
//           try {
//             await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailTemplateParams, USER_ID);
//             console.log(`Email sent successfully to ${emailTemplateParams.to_email}`);
//           } catch (emailError) {
//             console.error("Error sending email:", emailError);
//           }

//           // Update contact status via API
//           try {
//             const response = await axios.put(`http://localhost:3001/api/updateContactStatus/${order.orderId}`);
//             if (response.data.success) {
//               console.log(`Contact status updated to "Informed" for order ID: ${order.orderId}`);
//               return { ...order, ContactStatus: "Informed", canDispatch: true };
//             } else {
//               console.error("Error updating contact status:", response.data.message);
//             }
//           } catch (apiError) {
//             console.error("API error updating contact status:", apiError);
//           }
//         }

//         // If not in selectedOrderIds, return as is
//         return order;
//       });

//       // Resolve all promises to update the state
//       const resolvedUpdatedOrders = await Promise.all(updatedOrdersPromises);
//       setOrders(resolvedUpdatedOrders); // Update the orders state
//       setSelectedOrderIds([]); // Clear selection
//       alert("Selected contacts have been informed. Checkboxes are now cleared.");

//     } catch (error) {
//       console.error("Error in handleContactClick:", error);
//     }
//   };

//   const handleDispatchClick = async (orderId) => {
//     try {
//       // First, update the order status to "Dispatched"
//       const response = await axios.put("http://localhost:3001/api/updatestatus", { orderId });
//       if (response.data.success) {
//         const updatedOrders = orders.map((order) =>
//           order.orderId === orderId ? { ...order, status: "Dispatched" } : order
//         );
//         setOrders(updatedOrders);

//         // Find the order that was dispatched to get productId and quantity
//         const dispatchedOrder = orders.find(order => order.orderId === orderId);
//         if (dispatchedOrder) {
//           // Send data to the DispatchedOrders table
//           await axios.post("http://localhost:3001/api/dispatchedOrders", {
//             orderId: dispatchedOrder.orderId,
//             productId: dispatchedOrder.productId,
//             quantity: dispatchedOrder.quantity
//           });
//           console.log(`Dispatched order saved for order ID: ${orderId}`);
//         }
//       } else {
//         console.error("Failed to update order status:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error updating order status or saving dispatched order:", error);
//     }
//   };

//   const filteredOrders = orders.filter((order) =>
//     order[filterBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="whinm">
//       <div className="wmtitle">Order Section</div>
//       <div className="whintitle">Order Details <Link to="/admin/warehouse" className="whinbkbtn1">Warehouses</Link><Link to="/admin/current-stock" className="whinbkbtn1">Current Stock</Link></div>
//       <div className="filter-search-container">
//         <input className="whinsrch" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
//         <select className="whinsrch" onChange={handleFilterChange}>

//           <option value="orderId">Order ID</option>
//           <option value="productId">Product ID</option>
//           <option value="location">Location</option>
//           <option value="status">Status</option>
//           <option value="ContactStatus">Contact Status</option>
//         </select>
//         <button className="whinorbtn" onClick={handleContactClick}>Send Emails Selected</button>

//       </div>

//       <table className="whtt">
//         <thead>
//           <tr>
//             <th>Select</th>
//             <th>Order ID</th>
//             <th>Product ID</th>
//             <th>Quantity</th>
//             <th>Location</th>
//             <th>Status</th>
//             <th>Contact Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredOrders.map((order) => (
//             <tr key={order.orderId}>
//               <td>
//                 <input
//                   type="checkbox"
//                   checked={selectedOrderIds.includes(order.orderId)}
//                   onChange={() => handleOrderSelect(order.orderId)}
//                 />
//               </td>
//               <td>{order.orderId}</td>
//               <td>{order.productId}</td>
//               <td>{order.quantity}</td>
//               <td>{order.location}</td>
//               <td>
//                 {order.status === "Dispatched" ? (
//                   "Dispatched"
//                 ) : (
//                   order.canDispatch ? (
//                     <button
//                       className="whinbkbtn1"
//                       onClick={() => handleDispatchClick(order.orderId)}
//                     >
//                       Dispatch
//                     </button>
//                   ) : "Pending"
//                 )}
//               </td>
//               <td>{order.ContactStatus}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//     </div>
//   );
// };

// export default OrdersTable;
