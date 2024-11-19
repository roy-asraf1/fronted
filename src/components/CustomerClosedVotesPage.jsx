import React, { useState, useEffect, useCallback } from "react";
import CustomerToolbar from "./CustomerToolbar";
import VoteList from "./VoteList";

const CustomerClosedVotesPage = ({ contract, account, username, onLogout }) => {
  const [votes, setVotes] = useState([]);

  const loadVotes = useCallback(async () => {
    const voteCount = await contract.getVotesCount();
    let tempVotes = [];
    for (let i = 0; i < voteCount; i++) {
      const voteDetails = await contract.getVoteDetails(i);
      if (!voteDetails.isOpen) {
        tempVotes.push({
          id: Number(voteDetails.id),
          question: voteDetails.question,
          options: voteDetails.options,
          votesPerOption: voteDetails.votesPerOption.map((v) => Number(v)),
          closingDate: Number(voteDetails.closingDate),
          isOpen: voteDetails.isOpen,
        });
      }
    }
    setVotes(tempVotes);
  }, [contract]);

  useEffect(() => {
    if (contract) {
      loadVotes();
    }
  }, [contract, loadVotes]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <CustomerToolbar onLogout={onLogout} username={username} />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {username}</h1>
        <p className="text-gray-600 mb-6">Wallet Address: {account}</p>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Closed Votes</h2>
        <VoteList
          votes={votes}
          userVotes={{}}
          castVote={null}
          isAdmin={false}
        />
      </div>
    </div>
  );
};

export default CustomerClosedVotesPage;
