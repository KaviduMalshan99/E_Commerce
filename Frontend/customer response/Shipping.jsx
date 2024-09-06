import React from 'react'
import './Shipping.scss'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'


const Shipping = () => {
  return (
    
      <div className="shipping-container">
      <Header />
        <div className='shippinghead'>

          <h1 className='shippingex1'>Shipping Policy</h1>

          <h3 className='shippingex2'>DELIVERY</h3>

              <div class = "shippingpara">
                <ul>

                  <li className='shippingline'> 
                    Delivery will only be given to the shipping address provided by you. It is your responsibility that it is possible to ship to the address during normal working hours.
                  </li>
                  <li className='shippingline'>
                    We ship according to the delivery timelines provided for each product. We ensure that we ship as early as possible, but for some products the timelines are longer due to availability of products.
                  </li> 
                  <li className='shippingline'> 
                    Freedom Over Anything does not assume any sourcing risk especially with reference to a purchase by description. For returns policies, please check our section on Refund and Exchange.
                  </li>

                </ul>
              </div> 

        </div> 

      <Footer />  
      </div>      
      
      
  )
}

export default Shipping