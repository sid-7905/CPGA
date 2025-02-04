import React from "react";
import "./button.css";
import "animate.css";
import MyNavbar from "./navbar";
import About from "./about";
import LandingPage from "./LandingPage";
import Footer from "./Footer";
import Testimonials from "./testimonials";
import FAQ from "./FAQ";

const Landing = () => {
  return (
    <div className=" bg-gradient-to-b from-gray-900 to-gray-800">
      <div>
        <MyNavbar />
      </div>
      <div>
        <LandingPage />
      </div>
      <div>
        <About />
      </div>
      <div>
        <FAQ />
      </div>
      <div>
        <Testimonials />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
