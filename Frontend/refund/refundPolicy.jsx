import React from 'react';
import './refundPolicy.scss';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

const RefundPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className='refund-main'>
            <Header />
            <div className="rnmh">Refund</div>
            <div className="rnlp">Home &gt; Refund</div>

            <div className="rnmbtnss">
                <button id="transparent-buttonrr" onClick={() => navigate(`/refundPolicy`)}>
                    Refund Policy
                </button>
                <div className='iraa'>{" | "}</div>
                <button id="transparent-buttonrr" onClick={() => navigate(`/refund`)}>
                    Refund Now
                </button>
            </div> 

            <div className="refund-policy-content">
                <h2><center>REFUND AND RETURN POLICY</center></h2>

                <h3>NO RETURNS FOR SIZE ISSUES</h3>
                <ul>
                    <li>We do not accept returns or exchanges for size-related issues. Please refer to our size
                        guide carefully before making a purchase.</li>
                </ul>
                <h3>REPORTING DAMAGED PRODUCTS</h3>
                <ul>
                    <li>If your product arrives damaged, you must inform us within 24 hours of delivery.</li>
                    <li>Contact us through Instagram, Messenger, or WhatsApp to report the damage.</li>
                </ul>
                <h3>PROVIDING EVIDENCE OF DAMAGE</h3>
                <ul>
                    <li>When reporting a damaged product, please provide clear images of the damage to help us assess the issue.</li>
                    <li>Ensure the images clearly show the damaged areas of the product.</li>
                </ul>
                <h3>RETURN OF DAMAGED PRODUCTS</h3>
                <ul>
                    <li>If a refund or exchange is approved, you will need to return the damaged product to us.</li>
                    <li>The return shipping address will be provided once the issue is confirmed.</li>
                </ul>
                <h3>PROCESSING REFUNDS AND EXCHANGES</h3>
                <ul>
                    <li>Once the damaged product is received by us, we will process your refund or exchange the 
                        product as per your preference.</li>
                </ul>
                <h3>REFUND METHOD</h3>
                <ul>
                    <li>Refunds will be issued through the original payment method used for the purchase.</li>
                    <li>Your refund will be processed 2-3 days after the product has been received by us.</li>
                </ul>

                <h3>By following these steps, we aim to ensure a smooth and fair process for handling any issues with damaged products.</h3>
            </div>

            <Footer />
        </div>
    );
};

export default RefundPolicy;
