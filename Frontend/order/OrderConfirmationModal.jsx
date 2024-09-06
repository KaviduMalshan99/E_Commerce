import React from 'react';
import Modal from 'react-modal';
import { FaCheckCircle } from 'react-icons/fa';
import './OrderConfirmationModal.scss';

Modal.setAppElement('#root');

const OrderConfirmationModal = ({ isOpen, onContinue, orderDetails }) => {
    return (
        <Modal isOpen={isOpen} className="order-confirmation-modal" overlayClassName="order-confirmation-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <FaCheckCircle className="success-icon" />
                    <h2>Payment Successful</h2>
                    <p>Thank you! Your payment has been processed.</p>
                </div>
                <div className="order-id">Order ID: {orderDetails?.orderId}</div>
                <h3>Payment Details</h3>
                <div className="payment-details">
                    <p><strong>Country:</strong> <span>{orderDetails?.country}</span></p>
                    <p><strong>Name:</strong> <span>{orderDetails?.firstName} {orderDetails?.lastName}</span></p>
                    <p><strong>Contact:</strong> <span>{orderDetails?.contactNumber}</span></p>
                    <p><strong>Address:</strong> <span>{orderDetails?.address}, {orderDetails?.State}, {orderDetails?.city}</span></p>
                    <p><strong>Postal Code:</strong> <span>{orderDetails?.postalCode}</span></p>
                    <p><strong>Total Amount:</strong> <span>{orderDetails?.total}</span></p>
                </div>
                <div className="modal-buttons">
                    <button onClick={onContinue} className="continue-button">Continue Shopping</button>
                </div>
            </div>
        </Modal>
    );
};

export default OrderConfirmationModal;
