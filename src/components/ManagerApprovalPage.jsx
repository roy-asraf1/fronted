// src/components/ManagerApprovalPage.jsx
import React, { useState, useEffect } from "react";
import AdminToolbar from "./AdminToolbar";

const ManagerApprovalPage = ({ contract, account, username, onLogout }) => {
  const [requests, setRequests] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");
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

          if (status === 0) { // In Process
            tempRequests.push({
              id: Number(requestDetails.id),
              requester: requestDetails.requester,
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
        setErrorMessage("Failed to fetch withdrawal requests.");
      }
    };
    if (contract) {
      fetchRequests();
    }
  }, [contract]);

  const handleApprove = async (requestId) => {
    try {
      const tx = await contract.approveWithdrawalRequest(requestId);
      await tx.wait();
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error approving request:", error);
      setErrorMessage("Failed to approve request.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      const tx = await contract.rejectWithdrawalRequest(requestId);
      await tx.wait();
      setRequests(requests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
      setErrorMessage("Failed to reject request.");
    }
  };

  const filteredRequests = requests.filter((req) =>
    req.description.toLowerCase().includes(filterTerm.toLowerCase()) ||
    req.requester.toLowerCase().includes(filterTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AdminToolbar onLogout={onLogout} username={username} />
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pending Withdrawal Requests</h1>
        <input
          type="text"
          placeholder="Filter by customer or description..."
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          className="w-full p-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <table className="w-full bg-blue-50 rounded-lg shadow-sm mb-6">
          <thead>
            <tr className="text-left text-gray-700">
              <th className="p-4">Requester</th>
              <th className="p-4">Description</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Attachment</th>
              <th className="p-4">Actions</th>
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
                <td className="p-4">
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-600">
                  No pending requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerApprovalPage;
