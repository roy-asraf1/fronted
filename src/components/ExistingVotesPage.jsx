import React, { useEffect, useState, useCallback } from "react";
import AdminToolbar from "./AdminToolbar";
import VoteList from "./VoteList";

const ExistingVotesPage = ({ contract, account, username, onLogout }) => {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Existing Votes</h1>
        <VoteList votes={votes} closeVote={closeVote} isAdmin={true} />
      </div>
    </div>
  );
};

export default ExistingVotesPage;
