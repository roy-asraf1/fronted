// src/components/ManagerTransactionHistoryPage.jsx
import React, { useState, useEffect } from "react";
import AdminToolbar from "./AdminToolbar";

const ManagerTransactionHistoryPage = ({ contract, account, username, onLogout }) => {
  const [requests, setRequests] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestCount = await contract.getRequestCount();
        let tempRequests = [];
        for (let i = 0; i < requestCount; i++) {
          const requestDetails = await contract.getWithdrawalRequest(i);

          // Convert status to Number
          const status = Number(requestDetails.status);

          tempRequests.push({
            id: Number(requestDetails.id),
            requester: requestDetails.requester,
            description: requestDetails.description,
            amount: Number(requestDetails.amount),
            attachment: requestDetails.attachment,
            status: status,
          });
        }
        setRequests(tempRequests);
      } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
        setErrorMessage("Failed to fetch withdrawal requests.");
      }
    };
    if (contract) {
      fetchRequests();
    }
  }, [contract]);

  const filteredRequests = requests.filter((req) => {
    const matchesFilterTerm =
      req.description.toLowerCase().includes(filterTerm.toLowerCase()) ||
      req.requester.toLowerCase().includes(filterTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" || req.status.toString() === filterStatus;
    return matchesFilterTerm && matchesStatus;
  });

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "In Process";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AdminToolbar onLogout={onLogout} username={username} />
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Transaction History</h1>
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            placeholder="Filter by customer or description..."
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="0">In Process</option>
            <option value="1">Approved</option>
            <option value="2">Rejected</option>
          </select>
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <table className="w-full bg-blue-50 rounded-lg shadow-sm mb-6">
          <thead>
            <tr className="text-left text-gray-700">
              <th className="p-4">Requester</th>
              <th className="p-4">Description</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Attachment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} className="border-b border-gray-200">
                <td className="p-4">{req.requester}</td>
                <td className="p-4">{req.description}</td>
                <td className="p-4">{req.amount} wei</td>
                <td className="p-4">
                  {req.attachment ? (
                    <a href={req.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      View Attachment
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-4">{getStatusText(req.status)}</td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-600">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerTransactionHistoryPage;
