// src/components/CustomerRequestStatusPage.jsx
import React, { useState, useEffect } from "react";
import CustomerToolbar from "./CustomerToolbar";

const CustomerRequestStatusPage = ({ contract, account, username, onLogout }) => {
  const [requests, setRequests] = useState([]);
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

          if (requestDetails.requester.toLowerCase() === account.toLowerCase()) {
            tempRequests.push({
              id: Number(requestDetails.id),
              description: requestDetails.description,
              amount: Number(requestDetails.amount),
              attachment: requestDetails.attachment,
              status: status,
            });
          }
        }
        setRequests(tempRequests);
      } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
        setErrorMessage("Failed to fetch your withdrawal requests.");
      }
    };
    if (contract && account) {
      fetchRequests();
    }
  }, [contract, account]);

  const filteredRequests = requests.filter((req) =>
    filterStatus === "" || req.status.toString() === filterStatus
  );

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
      <CustomerToolbar onLogout={onLogout} username={username} />
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Withdrawal Requests</h1>
        <div className="flex space-x-4 mb-6">
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
              <th className="p-4">Description</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Attachment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} className="border-b border-gray-200">
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
                <td colSpan="4" className="p-4 text-center text-gray-600">
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

export default CustomerRequestStatusPage;
