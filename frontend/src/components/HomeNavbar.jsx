import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { showErrorToast, showInfoToast, showLoaderToast } from "./toastify";
import { User } from "lucide-react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const navigation = [
  { name: "Dashboard", to: "/" },
  { name: "Discussion", to: "/discussion" },
  { name: "Leaderboard", to: "/leaderboard" },
  { name: "Daily Problems", to: "/dailyProblems" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function handleLogout() {
  window.location.href = "/";
  localStorage.clear();
}

export default function Example() {
  const user = JSON.parse(localStorage.getItem("user"));
  const image = user.image;
  
  return (
    <div className="h-16 w-full mt-2">
      <Disclosure
        as="nav"
        className="border rounded-lg border-cyan-300 fixed w-full backdrop-blur-sm z-10"
      >
        <div className="w-full flex items-center justify-center">
          <div className="relative flex w-4/5 h-16 items-center justify-between">
            <div className="absolute inset-y-0 w-1/5 left-0 flex items-center lg:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <NavLink
              to="/"
              className="hidden lg:block shrink-0 text-white text-lg"
            >
              <img
                src={require("../assets/logo.png")}
                alt="Logo"
                className="h-14 w-20"
              />
            </NavLink>
            <div className="hidden lg:ml-6 lg:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    aria-current={item.current ? "page" : undefined}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "custom-btn"
                          : "text-gray-300 hover:bg-cyan-50 hover:text-black",
                        "rounded-lg px-3 py-2 text-sm font-medium"
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-1 border-[#64ffda] shadow-lg">
                      {image ? (
                        <img
                          src={`${backendUrl}/images/uploads/${image}`}
                          alt="Profile"
                          className="h-full w-full rounded-full object-cover bg-transparent"
                        />
                      ) : (
                        <User className="h-full w-full p-1 text-gray-400 object-cover" />
                      )}
                    </div>
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gradient-to-b from-gray-700 to-gray-800 py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a // Re render the page when came from different profile page
                      href={`/profile/${
                        JSON.parse(localStorage.getItem("user")).id
                      }`}
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                      Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <NavLink
                      to="/edit-profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                      Edit Profile
                    </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                      Sign out
                    </NavLink>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel className="lg:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                as="a"
                to={item.to}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}
