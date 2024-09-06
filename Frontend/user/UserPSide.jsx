import React, { useState, useEffect } from "react";
import "./UserPSide.scss"; 
import Revpge from "../customer response/Userreviews";
import Profile from "./UserProfile";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Cusort from '../order/CustomerOrders';

function App() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidePanelOpen(false); 
  };

  const toggleSidePanel = () => {
    setSidePanelOpen(!isSidePanelOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidePanelOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (isSidePanelOpen && !event.target.closest('.side-panel') && !event.target.closest('.menu-togglee')) {
        setSidePanelOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidePanelOpen]);

  return (
    <div>
      <Header />
      <div className="App">
        <div className={`side-panel ${isSidePanelOpen ? 'open' : ''}`}>
          <ul>
            <li
              className={activeTab === "Profile" ? "active" : ""}
              onClick={() => handleTabClick("Profile")}
            >
              <div className="sidepnlicon">
                <i className="fa-sharp fa-solid fa-user"></i>Profile
              </div>
            </li>
            <li
              className={activeTab === "Shopping" ? "active" : ""}
              onClick={() => handleTabClick("Shopping")}
            >
              <div className="sidepnlicon">
                <i className="fa-solid fa-cart-shopping"></i>Order
              </div>
            </li>
            <li
              className={activeTab === "Reviews" ? "active" : ""}
              onClick={() => handleTabClick("Reviews")}
            >
              <div className="sidepnlicon">
                <i className="fa-solid fa-comments"></i>Reviews
              </div>
            </li>
          </ul>
        </div>
        <div className="promain-content">
          {activeTab === "Profile" && <Profile />}
          {activeTab === "Shopping" && <Cusort />}
          {activeTab === "Reviews" && <Revpge />}
        </div>
      </div>
      <Footer />
      <div className="menu-togglee" onClick={toggleSidePanel}>
        &#9776;
      </div>
    </div>
  );
}

export default App;
