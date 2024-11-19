import React, { useState } from "react";
import AdminToolbar from "./AdminToolbar";

const AddUserPage = ({ contract, account, username, onLogout }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Customer"); // Default to "Customer"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roleEnum = {
    None: 0,
    Manager: 1,
    Customer: 2,
  };

  const isValidAddress = (address) => {
    return /^(0x)?[0-9a-fA-F]{40}$/.test(address);
  };
  
  const handleAddUser = async () => {
    setError("");
    setSuccess("");

    if (!isValidAddress(walletAddress)) {
      setError("Invalid wallet address. Please provide a valid Ethereum address.");
      return;
    }

    if (name.trim() === "") {
      setError("Username cannot be empty.");
      return;
    }

    const roleNumber = roleEnum[role];
    if (roleNumber === undefined) {
      setError("Invalid role selected.");
      return;
    }

    try {
    

      // Add the user
      const tx = await contract.addUser(walletAddress, name, roleNumber);
      await tx.wait();
      setSuccess("User added successfully!");
      setWalletAddress("");
      setName("");
      setRole("Customer"); // Reset role to "Customer"
    } catch (err) {
      console.error("Error adding user:", err);
      if (err.data && err.data.message) {
        setError(`Contract Error: ${err.data.message}`);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An error occurred while adding the user. Make sure you have the right permissions and check the console for details.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AdminToolbar onLogout={onLogout} username={username} />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Add New User</h1>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter username"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Customer">Customer</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
        >
          Add User
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  );
};

export default AddUserPage;
