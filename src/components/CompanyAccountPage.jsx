// src/components/CompanyAccountPage.jsx
import React, { useState, useEffect } from "react";
import AdminToolbar from "./AdminToolbar";

const CompanyAccountPage = ({ contract, account, username, onLogout }) => {
  const [balance, setBalance] = useState(0);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await contract.getCompanyBalance();
        setBalance(Number(balance));
      } catch (error) {
        console.error("Error fetching company balance:", error);
      }
    };
    if (contract) {
      fetchBalance();
    }
  }, [contract]);

  const handleAddFunds = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (amountToAdd <= 0) {
      setErrorMessage("Amount must be greater than zero.");
      return;
    }

    try {
      const tx = await contract.addFunds({ value: amountToAdd });
      await tx.wait();
      setSuccessMessage("Funds added successfully!");
      setAmountToAdd("");
      const balance = await contract.getCompanyBalance();
      setBalance(Number(balance));
    } catch (error) {
      console.error("Error adding funds:", error);
      setErrorMessage("Failed to add funds. Make sure you have sufficient balance and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AdminToolbar onLogout={onLogout} username={username} />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Company Account Management</h1>
        <p className="text-gray-600 mb-6">Manage the company's funds here.</p>
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Current Balance</h2>
          <p className="text-gray-800 text-lg">{balance} wei</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Amount to Add (in wei)</label>
          <input
            type="number"
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
          />
        </div>
        <button
          onClick={handleAddFunds}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
        >
          Add Funds
        </button>
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default CompanyAccountPage;
