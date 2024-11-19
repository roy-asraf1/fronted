// src/components/CustomerSidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  FolderOpenIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  BriefcaseIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const CustomerToolbar = ({ onLogout, username }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`bg-blue-600 text-white h-screen p-4 transition-all duration-300 fixed left-0 top-0 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col items-start">
          {/* Home Page */}
          <button
            onClick={() => navigate("/customer/home")}
            className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
          >
            <HomeIcon className="h-8 w-8" />
            {isExpanded && <span className="ml-2">Home Page</span>}
          </button>

          {/* Voting Section */}
          <div className="mt-4 w-full">
            <p className={`text-sm font-bold ${isExpanded ? "block" : "hidden"}`}>Voting</p>
            <button
              onClick={() => navigate("/customer/new-votes")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <FolderOpenIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Ongoing Votes</span>}
            </button>
            <button
              onClick={() => navigate("/customer/closed-votes")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <FolderOpenIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Closed Votes</span>}
            </button>
          </div>

          {/* Transaction Requests Section */}
          <div className="mt-4 w-full">
            <p className={`text-sm font-bold ${isExpanded ? "block" : "hidden"}`}>Transaction Requests</p>
            <button
              onClick={() => navigate("/customer/create-request")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <PlusCircleIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Create New Request</span>}
            </button>
            <button
              onClick={() => navigate("/customer/request-status")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <BriefcaseIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Requests Status</span>}
            </button>
          </div>
        </div>

        {/* Settings and Logout Buttons at the Bottom */}
        <div className="flex flex-col mt-auto w-full">
          {/* Settings */}
          <button
            onClick={() => navigate("/customer/settings")}
            className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
          >
            <Cog6ToothIcon className="h-8 w-8" />
            {isExpanded && <span className="ml-2">Settings</span>}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="hover:bg-red-600 w-full px-3 py-2 rounded transition duration-300 flex items-center mt-2"
          >
            <ArrowLeftOnRectangleIcon className="h-8 w-8" />
            {isExpanded && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerToolbar;
