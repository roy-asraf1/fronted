import React from "react";
import CustomerToolbar from "./CustomerToolbar";

const CustomerSettingsPage = ({ contract, account, username, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <CustomerToolbar onLogout={onLogout} username={username} />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Account Details</h1>
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Username</h2>
          <p className="text-gray-800 text-lg">{username}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Wallet Address</h2>
          <p className="text-gray-800 text-lg">{account}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettingsPage;
