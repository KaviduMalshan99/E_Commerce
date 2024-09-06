import { useState } from 'react';
import subimg from '../src/assets/sub.jpg'
import { toast } from 'react-toastify';
import './Subbbscribe.scss'
import { FaTimes } from 'react-icons/fa';  // Ensure react-icons is installed via npm or yarn

const Subbscribe = ({ onClose }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Thank you for subscribing!');
        onClose();
    };

    return (
        <div className="subscription-popup">
            <div className="popup-background" onClick={onClose} ></div> {/* Optional: click background to close */}
            <div className="popup-container">
                <img src={subimg} alt="Subscribe" className="subscription-image"/>
                <div className="popup-content">
                    <button className="close-button" onClick={onClose}><FaTimes /></button>
                    <h2>Subscribe Now!</h2>
                    <p>Enter your email to stay updated:</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{border:'1px solid'}}
                            required
                        />
                        <button type="submit" className="subscribe-button">Subscribe</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Subbscribe;
