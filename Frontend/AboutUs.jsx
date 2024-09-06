import React from 'react';
import Header from '../Frontend/Header/Header';
import Footer from '../Frontend/Footer/Footer';
import './AboutUs.scss';

import logo from '../src/assets/logoorange.png';

function AboutUs() {
  return (
    <>
      <div id="abtwrapper">
        <Header />
        <br />
        
         <div id="image1">
          <img src={logo}  />
        </div> 
        <br />
        
        <div className="about-us-content">
        <h1 >About Us</h1>

          <p>
            Well Worn is an online shoe and bags store based in Sri Lanka, known for its unique and
            diverse range of unbranded products. Operating for over a year, Well Worn has built a
            strong follower base and offers a wide range for both ladies and gents. Our products are
            characterized by their distinctive designs, appealing to customers willing to invest in quality
            and individuality. We cater to a market that values unique style over brand names. We are
            currently in the process of expanding to overseas markets and new product lines, aiming to
            evolve into a distinctive lifestyle brand online.
          </p>
          <br />

          <h1>Vision Statement</h1>
          <p>
            "To be the leading global online lifestyle brand from Sri Lanka, celebrated for our unique
            and diverse range of shoes and bags that empower individuality and inspire confidence."
          </p>
          <br />

          <h1>Mission Statement</h1>
          <p>
            "At Well Worn, our mission is to offer a curated collection of high-quality, shoes and bags
            that blend unique design with comfort and style. We aim to enhance our customers'
            shopping experience through exceptional service, innovative solutions, and a commitment
            to sustainability. As we expand to new markets and product ranges, we strive to empower
            our customers worldwide to express their individuality with every step they take."
          </p>
          <br />

          <h1>Convenience</h1>
          <br />
          <p>
            At WELL WORN convenience is key. Our user-friendly website allows you to browse, choose,
            and purchase your favorite styles with ease. Enjoy a seamless shopping experience from the
            comfort of your home, because looking good should be as effortless as possible.
          </p>
          <br />

          <h1>Quality</h1>
          <br />
          <p>
            Crafted with precision and a commitment to excellence, our products boast top-notch quality.
            We believe that every purchase from WELL WORN should be an investment in durable and
            timeless accessories that stand out in both style and substance.
          </p>
        </div>
        <br />
        <Footer />
      </div>
    </>
  );
}

export default AboutUs;
