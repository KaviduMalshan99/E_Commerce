import React from 'react'
import './Rating'
import { Rating } from '@mui/material'
import './Condition.scss' 
import Footer from '../Footer/Footer'
import Header from '../Header/Header'


const Condition = () => {
  return (
    
    <div className="maincontact1">
        <Header />
        <div className='maincondition'>
            <h1 className='contacth1'>Term & Conditions</h1>

            <p className='contactpara'>
            Welcome to Well Worn! These Terms and Conditions ("Terms") govern your use of our website and any related services provided by Well Worn (Pvt) Ltd ("we," "our," "us"). 
            By accessing or using our website and services, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use our website or services.
            </p>

            <div className = "conditionpara">
                <h3 className='contacth3'>Use of Our Website</h3>
                <ul className='coditionlineone'>
                    <li><b>Eligibility: </b>By using our website, you represent and warrant that you meet this eligibility requirement.</li>
                    <li><b>Account Registration: </b>To access certain features of our website, you may need to create an account. 
                        You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. 
                        You agree to provide accurate and complete information when creating your account.</li>
                    <li><b>Account Registration: </b>You agree not to:</li>
                    <ul className='coditionlinetwo'>
                        <li>Use our website for any unlawful purpose or in violation of any applicable laws or regulations.</li>
                        <li>Upload or transmit any harmful or malicious code, viruses, or other software intended to harm our website or other users.</li>
                        <li>Interfere with the operation of our website or the enjoyment of other users.</li>
                        <li>Attempt to gain unauthorized access to our website or any related systems or networks.</li>
                    </ul>
                </ul>
            </div>

            <div className = "conditionpara">
                <h3 className='contacth3'>Orders and Payment</h3>
                    <ul className='coditionlineone'>
                        < li><b> Product Availability: </b>All products are subject to availability. 
                            We reserve the right to limit the quantities of any products we offer and to discontinue any product at any time without notice.
                        </li>
                        < li><b>Pricing: </b>Prices for our products are subject to change without notice. We strive to display accurate pricing information, but errors may occur.
                             If we discover an error in the price of a product you have ordered,
                             we will contact you to give you the option of reconfirming your order at the correct price or canceling it.
                        </li>
                        < li><b>Payment: </b>By placing an order, you agree to provide current, complete, and accurate purchase and account information. 
                            We accept various payment methods through our secure payment gateway provider.
                        </li> 
                    </ul>
            </div> 

            <div className = "conditionpara">
                <h3 className='contacth3'>Returns and Refunds</h3>
                <ul className='coditionlineone'>
                    <li ><b>No Returns for Size Issues: </b>We do not accept returns or exchanges for size-related issues. 
                        Please refer to our size guide carefully before making a purchase.
                    </li>
                    <li ><b>Damaged Products: </b>If your product arrives damaged, you must inform us within 24 hours of delivery and provide clear images of the damage. 
                        We will either refund or exchange the product as per our Refund and Return Policy.
                    </li> 
                    <li ><b>Return of Damaged Products: </b>You will need to return the damaged product to us for inspection before we process a refund or exchange.
                    </li>
                </ul>
            </div>

            <div className = "conditionpara">
                <h3 className='contacth3'>Intellectual Property</h3>
                <ul className='coditionlineone'>
                    <li><b>Ownership: </b>All content on our website, including text, graphics, logos, images, and software, is the property of Well Worn or our licensors and is protected by copyright, trademark, and other intellectual property laws.
                    </li>
                    <li><b>Use of Content: </b>You may use the content on our website for personal, non-commercial purposes only. Any other use, including reproduction, modification, distribution, or republication, without our prior written consent, is strictly prohibited.
                    </li> 
                </ul>
            </div>

            <div className = "conditionpara">
                <h3 className='contacth3'>Limitation of Liability</h3>
                <ul className='coditionlineone'>
                    <li>To the fullest extent permitted by law, Well Worn shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, arising out of or related to your use of our website or services. 
                        Our total liability to you for any claims arising from your use of our website or services shall not exceed the amount you paid to us for the applicable products or services.
                    </li> 
                </ul>
            </div>

            <div className = "conditionpara">
                <h3 className='contacth3'>Indemnification</h3>
                <ul className='coditionlineone'>
                    <li>You agree to indemnify, defend, and hold harmless Well Worn and our officers, directors, employees, and agents from and 
                        against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or related to your use of our website or services, 
                        your violation of these Terms, or your violation of any rights of another.
                    </li> 
                </ul>
            </div>

            <div className = "conditionpara">
                <h3 className='contacth3'>Governing Law</h3>
                <ul className='coditionlineone'>
                    <li>These Terms shall be governed by and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law principles. Any disputes arising under or 
                        in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.
                    </li> 
                </ul>
            </div>

            <div className = "conditionpara">
                <h3 className='contacth3'>Changes to These Terms</h3>
                <ul className='coditionlineone'>
                    <li>We may update these Terms from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new Terms on our website. 
                        Your continued use of our website or services after such changes constitutes your acceptance of the new Terms.
                    </li> 
                </ul>
            </div>

            <h2 className='conditionendingpart'>Thank you for choosing Well Worn. We appreciate your business and are committed to providing you with high-quality products and excellent service.</h2>

        </div>

        <Footer />
    </div>
    
    
  )
}

export default Condition