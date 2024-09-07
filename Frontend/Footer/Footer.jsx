import React, { useState } from 'react';
import './Footer.scss';
import logoImage from './wellwornlogo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Footer() {
  const [isCollectionOpen, setCollectionOpen] = useState(false);
  const [isInfoOpen, setInfoOpen] = useState(false);
  const [isConnectOpen, setConnectOpen] = useState(false);

  const toggleCollection = () => setCollectionOpen(!isCollectionOpen);
  const toggleInfo = () => setInfoOpen(!isInfoOpen);
  const toggleConnect = () => setConnectOpen(!isConnectOpen);

  return (
    <footer className="footer">
      <div className='socialbar'>
        <ul className="social-links">
          <li><a href="https://www.facebook.com/share/JkhC5o8SXoMJ5yKj/?mibextid=qi2Omg"><i className="fab fa-facebook-f"></i></a></li>
          <li><a href="https://www.tiktok.com/@wellworn_sl?_t=8nzjcKw4wwK&_r=1"><i className="fab fa-tiktok"></i></a></li>
          <li><a href="https://www.instagram.com/wellworn_sl?igsh=MXJkaTU0a25ldGp0YQ=="><i className="fab fa-instagram"></i></a></li>
          <li><a href="https://www.linkedin.com/company/wellworn/"><i className="fab fa-linkedin"></i></a></li>
        </ul>
      </div>

      <div className='ftmcon'>
        <div className='logoos'>
          {/* <img src={logoImage} alt="Well Worn Logo" className="logo" /> */}
          {/* <label>Well Worn (Pvt) Ltd</label> */}
        </div>

        <div className="collection">
          <h3 onClick={toggleCollection}>COLLECTION {window.innerWidth <= 820 && <span className="dropdown-icon">{isCollectionOpen ? '▲' : '▼'}</span>}</h3>
          <ul className={isCollectionOpen ? 'open' : ''}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/men">Men</Link></li>
            <li><Link to="/women">Women</Link></li>
            <li><Link to="/exclusive">Exclusive</Link></li>
          </ul>
        </div>

        <div className="info">
          <h3 onClick={toggleInfo}>INFO {window.innerWidth <= 820 && <span className="dropdown-icon">{isInfoOpen ? '▲' : '▼'}</span>}</h3>
          <ul className={isInfoOpen ? 'open' : ''}>
            <li><a href="/aboutus">About Us</a></li>
            <li><Link to='/contactus'>Contact Us</Link></li>
            <li><Link to='/refund'>Refund and Returns</Link></li>
            <li><Link to='/privacy'>Privacy policy</Link></li>
            <li><Link to='/condition'>Terms and Conditions</Link></li>
          </ul>
        </div>

        <div className="connect">
          <h3 onClick={toggleConnect}>CONNECT {window.innerWidth <= 820 && <span className="dropdown-icon">{isConnectOpen ? '▲' : '▼'}</span>}</h3>
          <ul className={isConnectOpen ? 'open' : ''}>
            <li><a href="#"><FontAwesomeIcon icon={faPhone} style={{ color: '#ffffff' }} /> +94 75 272 6993</a></li>
            <li><a href="#"><FontAwesomeIcon icon={faEnvelope} style={{ color: '#ffffff' }} />  fashion.lk@gmail.com</a></li>
            <li><a href="https://wellworn.lk/"><FontAwesomeIcon icon={faGlobe} style={{ color: '#ffffff' }} /> www.ishopping.lk</a></li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        {/* © Well Worn 2024 | All rights reserved <br /> Developed by Elysian */}
      </div>
    </footer>
  );
}

export default Footer;
