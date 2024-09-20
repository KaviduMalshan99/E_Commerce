import { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CheckoutProvider } from '../Frontend/order/CheckoutContext';  // Adjust the path as necessary
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from './store/useAuthStore';

import Subbscribe from '../Frontend/Subbscribe';



// Frontend components
import ChatbotComponent from '../Frontend/chat/ChatbotComponent'; // Import the Chatbot component
import Men from '../Frontend/Men';
import Women from '../Frontend/Women';
import Best from '../Frontend/Best';
import Exclusive from '../Frontend/Header/Exclusive'
import Product from '../Frontend/Product';
import Cart from '../Frontend/Cart';
import Home from '../Frontend/Home';
import Refund from '../Frontend/refund/refund';
import RefundEdit from '../Frontend/refund/refundEdit';
import RefundPolicy from '../Frontend/refund/refundPolicy';
import Checkout from '../Frontend/order/Checkout';
import CustomerOrders from '../Frontend/order/CustomerOrders';
import NewArrivalsMain from '../Frontend/NewArrivalsMain';


import MenBag from '../Frontend/Header/MenBag';
import MenShoes from '../Frontend/Header/MenShoes';
import WomenBags from '../Frontend/Header/WomenBag';
import WomenShoes from '../Frontend/Header/WomenShoes';
import Sidep from '../Frontend/user/UserPSide'


import Admin from '../admin/admin';
import Dashboard from '../admin/Dashboard';
import Profile from '../admin/Profile';
import Categories from '../admin/Categories';
import Products from '../admin/Product';
import Users from '../admin/Users';
import UserDetails from '../admin/UserDetails';
import Orders from '../admin/Orders';
import Ratings from '../admin/Reviews';
import AddAdmin from '../admin/AddAdmin';
import HomeMen from '../Frontend/Home/HomeMen';

import Overview from '../admin/Overview';
import RefundOrders from '../admin/refundOrders';
import RefundEmail from '../admin/refundEmail';
import RefundApprove from '../admin/refundApproves';
import UserP from '../Frontend/user/UserProfile';
import OrderTracking from '../admin/OrderTracking';
import CustomerTracking from '../Frontend/tracking/CustomerTracking';
import CancelOrder from '../Frontend/tracking/AddOrderCancellation';
import OrderCancellation from '../admin/orderCancellation';
import AdmintChat from '../admin/AdminChat';
import DeliveredProducts from '../admin/DeliveredProducts';

import OrderTable from '../admin/order/OrderTable';
import OrderDetails from '../admin/order/OrderDetails';
import AdminDashboard from '../admin/order/AdminDashboard';
import ShippingMethodManager from '../admin/order/ShippingMethodManager';

import AboutUs from '../Frontend/AboutUs';
import Contactus from '../Frontend/customer response/Contactus'
import Review from '../Frontend/customer response/Rating'
import Userreviews from '../Frontend/customer response/Userreviews'
import Condition from '../Frontend/customer response/Condition'
import Privacy from '../Frontend/customer response/Privacy'
import Shipping from '../Frontend/customer response/Shipping'
import ReviewPercentageChart from '../Frontend/ReviewPercentageChart';


import ProductReviews from '../admin/ProductReviews';
import Faq from '../admin/faq'
import Faqemail from '../admin/Faqemail'
import AcceptedReviews  from '../admin/AcceptedReviews';




// User authentication components
import ULog from '../Frontend/user/UserLog';  // Login page
import Reg from '../Frontend/user/Reg';      // Registration page
import ForgotPassword from "../Frontend/user/ForgotPassword";

import CheckLoginStatus from './CheckLoginStatus'
import PrivateRoute from "./PrivateRoute"
import { USER_ROLES } from './constants/roles';


// Cart Context
import { CartProvider } from '../Frontend/CartContext';
import ResetPassword from "../Frontend/user/ResetPassword";


// Query client instance
const queryClient = new QueryClient();

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const subscribed = localStorage.getItem('subscribed');
    if (!isAuthenticated && !subscribed) {
        setShowPopup(true);
    }
  }, [isAuthenticated]);


  return (
    <GoogleOAuthProvider clientId="169065311100-teurpru54dqmh09mb5er3tc473n7fob1.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
    {showPopup && <Subbscribe onClose={() => setShowPopup(false)} />}
      <CartProvider>
        <Router>
        <CheckoutProvider>

          <Routes>
          <Route path='/men' element={<Men />} />



            <Route element={<CheckLoginStatus/>}>
              <Route path='/login' element={<ULog />} />
              <Route path='/register' element={<Reg />} />
              
            </Route>


            {/*main files*/}
            <Route path='/ulogin' element={<Sidep/>}/>
              <Route path='/login' element={<ULog />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path='/profilee' element={<UserP />} ></Route>
              <Route path='/' element={<Home />} />
              <Route path='/chat' element={<ChatbotComponent />} />
              <Route path='/men' element={<Men />} />
              <Route path='/women' element={<Women />} />
              <Route path='/exclusive' element={<Exclusive />} />
              <Route path='/best' element={<Best />} />
              <Route path='/exclusive' element={<Exclusive />} />
              <Route path='/product/:id' element={<Product />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/refund' element={<Refund />} />
              <Route path='/refundedit' element={<RefundEdit />} />
              <Route path='/refundpolicy' element={<RefundPolicy />} />
              <Route path='/menbag' element={<MenBag />} />
              <Route path='/menshoes' element={<MenShoes />} />
              <Route path='/womenbags' element={<WomenBags />} />
              <Route path='/womenshoes' element={<WomenShoes />} />
              <Route path='/homemen' element={<HomeMen />} />
              <Route path='/newarrivalsmain' element={<NewArrivalsMain />} />

              <Route path='/refundpolicy' element={<RefundPolicy />} />
              <Route path='/contactus' element={<Contactus />} />
              <Route path='/userreviews' element={<Userreviews />} />
              <Route path='/condition' element={<Condition />} />
              <Route path='/privacy' element={<Privacy />} />
              <Route path='/shipping' element={<Shipping />} />
              <Route path="/tracking/:orderId/:productId" element={<CustomerTracking />} />
              <Route path='/ordercancel' element={<CancelOrder />} />
              <Route path='/aboutus' element={<AboutUs />} />




            {/* Common Routes */}
            <Route
              element={
                <PrivateRoute
                  permissionLevel={[USER_ROLES.CUSTOMER, USER_ROLES.ADMIN]}
                />

              }
            >

              <Route path='/' element={<Home />} />
              
              

            </Route>

            

            {/* Customer Routes */}
            <Route
              element={<PrivateRoute permissionLevel={[USER_ROLES.CUSTOMER]} />}
            >
              {/* <Route path="/customer" element={<Customer /200>} /> */}
              <Route path='/ulogin' element={<Sidep/>}/>
              <Route path='/login' element={<ULog />} />
              <Route path='/profilee' element={<UserP />} ></Route>
              <Route path='/' element={<Home />} />
              <Route path='/men' element={<Men />} />
              <Route path='/women' element={<Women />} />
              <Route path='/exclusive' element={<Exclusive />} />
              <Route path='/best' element={<Best />} />
              <Route path='/product/:id' element={<Product />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/refund' element={<Refund />} />
              <Route path='/refundedit/:orderId' element={<RefundEdit />} />
              <Route path='/refundpolicy' element={<RefundPolicy />} />
              <Route path='/menbag' element={<MenBag />} />
              <Route path='/menshoes' element={<MenShoes />} />
              <Route path='/womenbags' element={<WomenBags />} />
              <Route path='/womenshoes' element={<WomenShoes />} />
              <Route path='/homemen' element={<HomeMen />} />
              <Route path='/rating/:orderId' element={<Review />} />
              <Route path='/reviewsByProductId/:productId' element={<ReviewPercentageChart />} />
              <Route path="/tracking/:orderId/:productId" element={<CustomerTracking />} />
              <Route path='/ordercancel' element={<CancelOrder />} />
              <Route path='/CustomerOrders' element={<CustomerOrders />} />
              <Route path='/newarrivalsmain' element={<NewArrivalsMain />} />



              
            </Route>

            {/* Admin Routes */}
            <Route
              element={<PrivateRoute permissionLevel={[USER_ROLES.ADMIN]} />}
            >
             <Route path='/admin' element={<Admin />} >
             <Route path='addadmin' element={<AddAdmin />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='profile' element={<Profile />} />
              <Route path='categories' element={<Categories />} />
              <Route path='products' element={<Products />} />
              <Route path='users' element={<Users />} />
              <Route path='userdetails/:UserId' element={<UserDetails />} />
              <Route path='orders' element={<Orders />} />
              <Route path='rating' element={<Ratings />} />
              <Route path='overview' element={<Overview />} />
              <Route path='refundorder' element={<RefundOrders />} />
              <Route path='refundemail' element={<RefundEmail />} />
              <Route path='refundapprove' element={<RefundApprove />} />
              <Route path='ordertrack' element={<OrderTracking />} />
              <Route path='OrderCancellation' element={<OrderCancellation />} />
              <Route path='adminchat' element={<AdmintChat />} />
              <Route path='deliveredProducts' element={<DeliveredProducts />} />


              <Route path='OrderTable' element={<OrderTable />} />
              <Route path='coupon' element={<AdminDashboard />} />
              <Route path='OrderDetails/:orderId' element={<OrderDetails />} />
              <Route path='Shipping' element={<ShippingMethodManager />} />

              <Route path='rating' element={<Ratings />} />
              <Route path='productreviews/:productId' element={<ProductReviews />} />
              <Route path='faq' element={<Faq/>} />
              <Route path='faqemail/:faqId' element={<Faqemail />} />
              <Route path='acceptreview' element={<AcceptedReviews />} />

            </Route>

            </Route>
            <Route path='/ulogin' element={<Sidep/>}/>
            <Route path='/' element={<Home />} />
            <Route path='/men' element={<Men />} />
            <Route path='/women' element={<Women />} />
            <Route path='/exclusive' element={<Exclusive />} />
            <Route path='/best' element={<Best />} />
            <Route path='/product/:id' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/CustomerOrders' element={<CustomerOrders />} />
            <Route path='/refund' element={<Refund />} />
            <Route path='/refundedit' element={<RefundEdit />} />
            <Route path='/refundpolicy' element={<RefundPolicy />} />
            <Route path='/newarrivalsmain' element={<NewArrivalsMain />} />

            <Route path='/menbag' element={<MenBag />} />
            <Route path='/menshoes' element={<MenShoes />} />
            <Route path='/womenbags' element={<WomenBags />} />
            <Route path='/womenshoes' element={<WomenShoes />} />
            <Route path='/homemen' element={<HomeMen />} />
            {/* <Route path='/custrack' element={<CustomerTracking />} /> */}


            

            
          </Routes>
          </CheckoutProvider>

        </Router>
      </CartProvider>
    </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
