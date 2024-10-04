import './Header.scss';
import Logo from '../../src/assets/1-removebg-preview.png';
import Logo1 from '../../src/assets/Black and White Circle Business Logo.png';
import Logo2 from '../../src/assets/Black_and_White_Circle_Business_Logo-removebg-preview11.png';
import { useCart } from '../CartContext';
import Menbag from '../../src/assets/menbag.png';
import MenShoe from '../../src/assets/Menshoe.png';
import WomenBag from '../../src/assets/womenbag.png';
import WomenShoe from '../../src/assets/womenshoe.png';
import cartimg from '../../src/assets/cart.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useState, useEffect, useRef } from 'react';
import { FaAngleDown, FaAngleLeft } from 'react-icons/fa';
Black_and_White_Circle_Business_Logo-removebg-preview
const Header = () => {
    const { cartItems } = useCart();
    const numberOfDistinctProducts = cartItems.length;
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [submenu, setSubmenu] = useState(null);
    const [dropdown, setDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const handleUserIconClick = () => {
        if (isAuthenticated) {
            navigate('/ulogin');
        } else {
            navigate('/login');
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate(`/search?query=${searchQuery}`);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setSubmenu(null); // Reset submenu when toggling menu
    };

    const openSubmenu = (submenu) => {
        setSubmenu(submenu);
    };

    const closeSubmenu = () => {
        setSubmenu(null);
    };

    const getUserInitials = (firstName, lastName) => {
        if (!firstName || !lastName) return '';
        return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
    };

    const handleDropdownClick = (type) => {
        if (dropdown === type) {
            setDropdown(null);
        } else {
            setDropdown(type);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdown(null);
        }
    };

    const handleScroll = () => {
        setDropdown(null);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="header-main">
            <div className="header-left">
                <Link to={'/'}><img src={Logo2} alt="Logo" className="header-logo" /></Link>
            </div>

            <div className="header-center">
                <ul>
                    <li><Link to='/' className="nav-linkk">Home</Link></li>
                    <li
                        className={`nav-linkk ${dropdown === 'men' ? 'highlight' : ''}`}
                        onClick={() => handleDropdownClick('men')}
                    >
                        Men <FaAngleDown className="dropdown-iconn" />
                        <div className={`dropdown-contentt ${dropdown === 'men' ? 'show' : ''}`} ref={dropdown === 'men' ? dropdownRef : null}>
                            <div className="dropdown-sectionn">
                                <Link to='/menbag'>
                                    <p className="dropdown-itemm">Men's Bags</p>
                                    <img src={Menbag} className="dropdown-imgg" alt="Men's Bags" />
                                </Link>
                                <div className="dropdown-separatorr"></div>
                                <Link to='/men'>
                                    <p className="dropdown-itemm large-textt">Men's All</p>
                                </Link>
                                <div className="dropdown-separatorr"></div>
                                <Link to='/menshoes'>
                                    <p className="dropdown-itemm">Men's Shoes</p>
                                    <img src={MenShoe} className="dropdown-imgg" alt="Men's Shoes" />
                                </Link>
                            </div>
                        </div>
                    </li>
                    <li
                        className={`nav-linkk ${dropdown === 'women' ? 'highlight' : ''}`}
                        onClick={() => handleDropdownClick('women')}
                    >
                        Women <FaAngleDown className="dropdown-iconn" />
                        <div className={`dropdown-contentt ${dropdown === 'women' ? 'show' : ''}`} ref={dropdown === 'women' ? dropdownRef : null}>
                            <div className="dropdown-sectionn">
                                <Link to='/womenbags'>
                                    <p className="dropdown-itemm">Women's Bags</p>
                                    <img src={WomenBag} className="dropdown-imgg" alt="Women's Bags" />
                                </Link>
                                <div className="dropdown-separatorr"></div>
                                <Link to='/women'>
                                    <p className="dropdown-itemm large-textt">Women's All</p>
                                </Link>
                                <div className="dropdown-separatorr"></div>
                                <Link to='/womenshoes'>
                                    <p className="dropdown-itemm">Women's Shoes</p>
                                    <img src={WomenShoe} className="dropdown-imgg" alt="Women's Shoes" />
                                </Link>
                            </div>
                        </div>
                    </li>
                    <li><Link to='/exclusive' className="exclusive-link"></Link></li>
                </ul>
            </div>

            <div className="header-right">
                <ul className="user-cart">
                    <li className="user-icon">
                        <div className="user-icon-container" onClick={handleUserIconClick}>
                            {isAuthenticated && user ? (
                                <div className="user-initials">
                                    {getUserInitials(user.firstName, user.lastName)}
                                </div>
                            ) : (
                                <i className="far fa-user-circle fa-xl" style={{ color: '#ffffff' }}></i>
                            )}
                        </div>
                    </li>
                    <li className="cart-icon">
                        <div className="cart-icon-container">
                            <Link to='/cart'>
                                <img src={cartimg} alt="cartimg" />
                                <span className="cart-count">{numberOfDistinctProducts}</span>
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="menu-icon" onClick={toggleMenu}>
                <i className="fas fa-bars fa-xl" style={{ color: '#ffffff' }}></i>
            </div>
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <ul>
                    {!submenu && (
                        <>
                            <li><Link to='/' onClick={toggleMenu} className="mobile-menu-link">Home</Link></li>
                            <li><span onClick={() => openSubmenu('men')} className="mobile-menu-link">Men</span></li>
                            <li><span onClick={() => openSubmenu('women')} className="mobile-menu-link">Women</span></li>
                            <li><Link to='/exclusive' className="exclusive-link" onClick={toggleMenu}>Exclusive</Link></li>
                            <li><Link to='/ulogin' onClick={toggleMenu} className="mobile-menu-link">Profile</Link></li>
                            <li><Link to='/cart' onClick={toggleMenu} className="mobile-menu-link">Cart</Link></li>
                        </>
                    )}
                    {submenu === 'men' && (
                        <>
                            <li><span onClick={closeSubmenu} className="mobile-menu-link"><FaAngleLeft /> Back</span></li>
                            <li><Link to='/men' onClick={toggleMenu} className="mobile-menu-link">Shop All Men's</Link></li>
                            <li><Link to='/menbag' onClick={toggleMenu} className="mobile-menu-link">Men's Bags</Link></li>
                            <li><Link to='/menshoes' onClick={toggleMenu} className="mobile-menu-link">Men's Shoes</Link></li>
                        </>
                    )}
                    {submenu === 'women' && (
                        <>
                            <li><span onClick={closeSubmenu} className="mobile-menu-link"><FaAngleLeft /> Back</span></li>
                            <li><Link to='/women' onClick={toggleMenu} className="mobile-menu-link">Shop All Women's</Link></li>
                            <li><Link to='/womenbags' onClick={toggleMenu} className="mobile-menu-link">Women's Bags</Link></li>
                            <li><Link to='/womenshoes' onClick={toggleMenu} className="mobile-menu-link">Women's Shoes</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Header;
