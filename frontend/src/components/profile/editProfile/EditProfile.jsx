import React, { useState } from "react";
import { UserCircle, Phone, Share2, Lock, Menu, X } from "lucide-react";
import HomeNavbar from "../../HomeNavbar";
import Idform from "../Idform";
import EditUserInfo from "./EditUserInfo";
import EditContactDetails from "./EditContactDetails";
import ChangePassword from "./ChangePassword";

const EditProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "profile", label: "Profile Information", icon: UserCircle },
    { id: "contact", label: "Contact Details", icon: Phone },
    { id: "social", label: "Platform Accounts", icon: Share2 },
    { id: "security", label: "Security Settings", icon: Lock },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "contact":
        return <EditContactDetails />;
      case "social":
        return <Idform />;
      case "security":
        return <ChangePassword />;
      default:
        return <EditUserInfo />;
    }
  };

  return (
    <div className=" md:overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <HomeNavbar />

      {/* Mobile Navigation */}
      <div className="md:hidden bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-lg font-semibold text-white">Edit Profile</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-400 hover:text-white"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`
              md:static md:translate-x-0
              fixed inset-y-0 left-0 w-64 transform 
              ${
                isMobileMenuOpen
                  ? "translate-x-0 z-30"
                  : "-translate-x-full z-2 "
              }
              transition-transform duration-200 ease-in-out
              bg-gray-900 border-r border-gray-800" 
            `}
          style={{
            minHeight: `calc(100vh - ${
              document.querySelector("nav")?.offsetHeight || 0
            }px)`,
          }}
        >
          {/* Sidebar Header */}
          <div className="p-4">
            <div className="hidden md:block mb-6">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <p className="text-sm text-gray-400">
                Manage your account settings
              </p>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabClick(id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                    transition-colors duration-200 text-left
                    ${
                      activeTab === id
                        ? "bg-gradient-to-r from-blue-900 to-cyan-900 text-white"
                        : "text-gray-400 hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8"> 
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EditProfilePage;
