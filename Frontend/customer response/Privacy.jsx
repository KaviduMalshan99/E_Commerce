import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './Privacy.scss'


const Privacy = () => {
  return (
    <div className="main3">
    <Header />
        <div className='privacymain'>
            <h1 className='privacytopic'>Privacy & Policy</h1>

            <p className='privacyparagraph'>
                Well Worn (Pvt) Ltd values your privacy and is committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage with us through social media platforms 
                (Instagram, Facebook, WhatsApp, TikTok) and other services. Please read this policy carefully to understand our views and practices regarding your personal data.
            </p>
                    
            <h2 className='privacysubone'>Information We Collect</h2>

                <div class = "privacypara">
                    <ul>
                        <li className='privacylistone'>Personal Identification Information:</li>
                        <ul className='privacylisttwo'>
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Shipping address</li>
                            <li>Payment information <br/>(collected through our payment gateway provider)</li>
                            {/* <p className='privacyparagraph'>
                                As part of your registration as a customer on <b>wellworn.com</b> you will be asked to provide personal data. 
                                This is data which is required by us to process the contracts concluded on <b>www.wellworn.com.</b>
                                All personal data is confidential and will be treated by us in accordance with relevant legal regulations. 
                                To safeguard your privacy in online payment transactions wellworn.com uses the latest encryption techniques through our payment gateways.
                            </p> */}
                        </ul>
                    </ul>
                </div>
                
                <div class = "privacypara">
                    <ul className='privacy_special'>
                        <li className='privacylistone' >Non-Personal Identification <br/>Information:</li>
                        <ul className='privacylisttwo'>
                            <li>Browser type</li>
                            <li>IP address</li>
                            <li>Pages visited on our website</li>
                            <li>Referring URL</li>
                            <li>Device type</li>
                            <li>Operating system</li>
                        </ul>
                    </ul>
                </div>

                <div class = "privacypara">
                    <ul>
                        <li className='privacylistone'>Cookies and Tracking Technologies:</li>
                        <ul className='privacylisttwo'>
                            <li>We use cookies and similar tracking technologies to enhance your experience on our website. 
                                These technologies help us understand how you use our site and enable us to personalize your experience.</li>
                        </ul>
                    </ul>
                </div>

            <h3 className='privacysub'>How We Use Your Information</h3>  
            <div class = "privacypara">
                <ul className='privacylistthree'>
                    <li>To process and fulfill your orders</li>
                    <li>To communicate with you regarding your order status, account, 
                        and other customer service needs</li> 
                    <li>To improve our website and services based on your feedback and interactions</li> 
                    <li>To personalize your experience and deliver content and
                         product offerings relevant to your interests</li> 
                    <li>To send you promotional materials and updates about our products, services, 
                        and offers (you may opt-out at any time)</li> 
                    <li>To comply with legal obligations and protect our rights</li>
                </ul>
            </div>

            <h3 className='privacysub'>How We Protect Your Information</h3>  
            <div class = "privacypara">
                <ul className='privacylistthree'>
                    <li>We implement a variety of security measures to maintain the safety of your personal information. 
                        These measures include secure servers, SSL encryption, and restricted access to your personal data.</li>
                    <li>While we strive to use commercially acceptable means to protect your personal information, 
                        we cannot guarantee its absolute security.</li>
                </ul>
            </div>

            <h3 className='privacysub'>Sharing Your Information</h3>  
            <div class = "privacypara">
                <ul className='privacylistthree'>
                    <li>We do not sell, trade, or rent your personal identification information to others.</li>
                    <li>We may share your information with third-party service providers who assist us in operating our website, 
                        conducting our business, or servicing you, as long as these parties agree to keep this information confidential.</li>
                    <li>We may also disclose your information when required by law or to protect our rights, property, or safety, or the rights, 
                        property, or safety of others.</li>
                </ul>
            </div>

            <h3 className='privacysub'>Your Rights</h3>  
            <div class = "privacypara">
                <ul className='privacylistthree'>
                    <li><b>Access and Update: </b>You have the right to access and update your personal information by contacting us.</li>
                    <li><b>Opt-Out: </b>You can opt-out of receiving our promotional emails by following the unsubscribe instructions 
                        provided in each email or by contacting us directly.</li>
                    <li><b>Deletion: </b>You may request the deletion of your personal data, and 
                        we will comply unless we are required to retain the information by law.</li>
                </ul>
            </div>

            <h3 className='privacysub'>Third-Party Links</h3>  
            <div class = "privacypara">
                <ul className='privacylistthree'>
                    <li>Our website may contain links to other websites operated by third parties. 
                        We do not control these websites and are not responsible for their privacy practices. 
                        We encourage you to review the privacy policies of these third-party sites.</li>
                </ul>
            </div>

            <h3 className='privacysub'>Changes to This Privacy Policy</h3>  
            <div class = "privacypara">
                <ul className='privacylistthree'>
                    <li>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                        We will notify you of any significant changes by posting the new Privacy Policy on our website. 
                        Your continued use of our services after such changes constitutes your acceptance of the new policy.</li>
                </ul>
            </div>

            <h3 className='privacysub'></h3>  
            <div class = "privacyparalast">
                <h2 className='privacyheaderlastfirst'>Thank you for trusting Well Worn with your personal information. We are committed to safeguarding your privacy and ensuring a secure shopping experience.</h2>
            </div>

        </div>

        <Footer />
    </div>
  )
}

export default Privacy