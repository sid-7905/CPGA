import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

const navigation = [
  { name: "Home", to: "home", current: true },
  { name: "About", to: "about", current: false },
  { name: "FAQs", to: "faqs", current: false },
];

const handleScroll = (section) => {
  const Section = document.getElementById(section);
  const yOffset = -70;
  const y = Section?.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed w-full z-50 px-4">
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div
              className={`mx-auto max-w-6xl ${
                scrolled
                  ? "my-4 bg-gray-900/95 shadow-lg shadow-cyan-900/20 border border-gray-800"
                  : "my-6 bg-transparent"
              } rounded-2xl backdrop-blur-md transition-all duration-300`}
            >
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  {/* Logo */}
                  <div className="flex items-center">
                    <NavLink to="/" className="hidden lg:block shrink-0 text-white text-lg">
                      <img
                        src={require("../../assets/logo.png")}
                        alt="Logo"
                        className="h-14 w-20"
                      />
                    </NavLink>
                  </div>

                  {/* Desktop Navigation */}
                  <div className="hidden sm:flex items-center gap-8">
                    <div className="flex gap-6">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          onClick={() => handleScroll(item.to)}
                          className={({ isActive }) =>
                            `relative px-1 py-2 text-sm font-medium transition-colors hover:text-cyan-400
                            ${isActive ? "text-cyan-400" : "text-gray-300"}
                            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full 
                            after:origin-left after:scale-x-0 after:bg-cyan-400 
                            after:transition-transform hover:after:scale-x-100`
                          }
                        >
                          {item.name}
                        </NavLink>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <NavLink
                        to="/login"
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/register"
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-[#64ffda] text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Sign Up
                      </NavLink>
                    </div>
                  </div>

                  {/* Mobile menu button */}
                  <div className="sm:hidden">
                    <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none">
                      <Menu
                        className={`h-6 w-6 transition-transform duration-200 ${
                          open ? "rotate-90" : ""
                        }`}
                      />
                    </DisclosureButton>
                  </div>
                </div>
              </div>

              {/* Mobile menu */}
              <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-4 pb-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      onClick={() => handleScroll(item.to)}
                      className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-cyan-400 rounded-lg transition-colors"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                  <div className="mt-4 space-y-2">
                    <NavLink
                      to="/login"
                      className="block w-full px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-cyan-400 rounded-lg transition-colors"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="block w-full px-3 py-2 text-base font-medium text-center bg-gradient-to-r from-cyan-500 to-[#64ffda] text-gray-900 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Sign Up
                    </NavLink>
                  </div>
                </div>
              </DisclosurePanel>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}
