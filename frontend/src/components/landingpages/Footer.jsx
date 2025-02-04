import React from 'react';
import {NavLink} from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t to-gray-800 from-gray-950 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold">CPGA</h2>
            <p className="text-gray-400">Making the web a better place, one project at a time.</p>
          </div>
          <div className="w-full sm:w-auto">
            <div className="flex justify-center sm:justify-start">
              <a href="#" className="text-gray-400 hover:text-white mx-2">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white mx-2">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white mx-2">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white mx-2">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-4">
          <p className="text-center text-gray-400">&copy; 2023 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
