import React from 'react';
import './Modal.scss'; // Ensure correct path

function OrderConfirmationModal({ onContinue, onDownload }) {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Your order has been successfully placed!</h3>
                <img src="src/assets/confirm.png" alt="Order Successful" className="success-image"/>
                <div className="modal-actions">
                    <button onClick={onContinue} className="btn continue-btn">Continue Shopping</button>
                    <button onClick={onDownload} className="btn download-btn">Download Order Confirmation</button>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmationModal;
