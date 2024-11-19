// src/components/AdminSidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  FolderOpenIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  UsersIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const AdminToolbar = ({ onLogout, username }) => {
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
            onClick={() => navigate("/admin/home")}
            className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
          >
            <HomeIcon className="h-8 w-8" />
            {isExpanded && <span className="ml-2">Home Page</span>}
          </button>

          {/* Voting Management Section */}
          <div className="mt-4 w-full">
            <p className={`text-sm font-bold ${isExpanded ? "block" : "hidden"}`}>Voting Management</p>
            <button
              onClick={() => navigate("/admin/add-vote")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <PlusCircleIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Add New Vote</span>}
            </button>
            <button
              onClick={() => navigate("/admin/existing-votes")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <FolderOpenIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Manage Ongoing Votes</span>}
            </button>
            <button
              onClick={() => navigate("/admin/voting-repository")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <FolderOpenIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Voting Repository</span>}
            </button>
          </div>

          {/* Transactions Section */}
          <div className="mt-4 w-full">
            <p className={`text-sm font-bold ${isExpanded ? "block" : "hidden"}`}>Transactions</p>
            <button
              onClick={() => navigate("/admin/approval-requests")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <BriefcaseIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Approval Requests</span>}
            </button>
            <button
              onClick={() => navigate("/admin/transaction-history")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <BriefcaseIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Transaction History</span>}
            </button>
          </div>

          {/* Company Account Section */}
          <div className="mt-4 w-full">
            <p className={`text-sm font-bold ${isExpanded ? "block" : "hidden"}`}>Company Account</p>
            <button
              onClick={() => navigate("/admin/company-account")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <BanknotesIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Company Account</span>}
            </button>
          </div>

          {/* User Management Section */}
          <div className="mt-4 w-full">
            <p className={`text-sm font-bold ${isExpanded ? "block" : "hidden"}`}>User Management</p>
            <button
              onClick={() => navigate("/admin/user-management")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <UsersIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Existing Users</span>}
            </button>
            <button
              onClick={() => navigate("/admin/add-user")}
              className="flex items-center space-x-2 hover:bg-blue-700 w-full px-3 py-2 rounded transition duration-300"
            >
              <PlusCircleIcon className="h-8 w-8" />
              {isExpanded && <span className="ml-2">Add New User</span>}
            </button>
          </div>
        </div>

        {/* Settings and Logout Buttons at the Bottom */}
        <div className="flex flex-col mt-auto w-full">
          {/* Settings */}
          <button
            onClick={() => navigate("/admin/settings")}
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

export default AdminToolbar;
