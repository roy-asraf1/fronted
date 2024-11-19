import React, { useState, useEffect, useCallback } from "react";
import AdminToolbar from "./AdminToolbar";
import VoteList from "./VoteList";

const AdminPage = ({ contract, account, username, onLogout }) => {
  const [votes, setVotes] = useState([]);

  const loadVotes = useCallback(async () => {
    try {
      const voteCount = await contract.getVotesCount();
      let tempVotes = [];
      for (let i = 0; i < voteCount; i++) {
        const voteDetails = await contract.getVoteDetails(i);
        tempVotes.push({
          id: Number(voteDetails.id),
          question: voteDetails.question,
          options: voteDetails.options,
          votesPerOption: voteDetails.votesPerOption.map((v) => Number(v)),
          closingDate: Number(voteDetails.closingDate),
          isOpen: voteDetails.isOpen,
        });
      }
      setVotes(tempVotes);
    } catch (error) {
      console.error("Error loading votes:", error);
    }
  }, [contract]);

  useEffect(() => {
    if (contract) {
      loadVotes();
    }
  }, [contract, loadVotes]);

  const closeVote = async (voteId) => {
    try {
      await contract.closeVote(voteId);
      loadVotes();
    } catch (error) {
      console.error("Error closing vote:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AdminToolbar onLogout={onLogout} username={username} />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, {username} (Manager)
        </h1>
        <p className="text-gray-600 mb-4">Wallet Address: {account}</p>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Existing Votes</h2>
        <VoteList votes={votes} closeVote={closeVote} isAdmin={true} />
      </div>
    </div>
  );
};

export default AdminPage;
