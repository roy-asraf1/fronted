// src/components/CustomerRequestCreationPage.jsx
import React, { useState } from "react";
import CustomerToolbar from "./CustomerToolbar";

const CustomerRequestCreationPage = ({ contract, account, username, onLogout }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [attachment, setAttachment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateRequest = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (amount <= 0 || description.trim() === "") {
      setErrorMessage("Please provide a valid amount and description.");
      return;
    }

    try {
      const tx = await contract.createWithdrawalRequest(description, amount, attachment);
      await tx.wait();
      setSuccessMessage("Withdrawal request created successfully!");
      setDescription("");
      setAmount("");
      setAttachment("");
    } catch (error) {
      console.error("Error creating withdrawal request:", error);
      setErrorMessage("Failed to create withdrawal request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <CustomerToolbar onLogout={onLogout} username={username} />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Withdrawal Request</h1>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Amount (in wei)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Attachment (URL)</label>
          <input
            type="text"
            value={attachment}
            onChange={(e) => setAttachment(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter attachment URL"
          />
        </div>
        <button
          onClick={handleCreateRequest}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Submit Request
        </button>
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default CustomerRequestCreationPage;
