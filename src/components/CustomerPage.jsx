import React, { useState, useEffect, useCallback } from "react";
import VoteList from "./VoteList";
import CustomerToolbar from "./CustomerToolbar";

const CustomerPage = ({ contract, account, username, onLogout }) => {
  const [votes, setVotes] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  const loadVotes = useCallback(async () => {
    const voteCount = await contract.getVotesCount();
    let tempVotes = [];
    let tempUserVotes = {};
    for (let i = 0; i < voteCount; i++) {
      const voteDetails = await contract.getVoteDetails(i);
      const hasVoted = await contract.hasUserVoted(i, account);
      tempVotes.push({
        id: Number(voteDetails.id),
        question: voteDetails.question,
        options: voteDetails.options,
        votesPerOption: voteDetails.votesPerOption.map((v) => Number(v)),
        closingDate: Number(voteDetails.closingDate),
        isOpen: voteDetails.isOpen,
      });
      tempUserVotes[i] = hasVoted;
    }
    setVotes(tempVotes);
    setUserVotes(tempUserVotes);
  }, [contract, account]);

  useEffect(() => {
    if (contract) {
      loadVotes();
    }
  }, [contract, loadVotes]);

  const castVote = async (voteId, optionIndex) => {
    try {
      await contract.vote(voteId, optionIndex);
      loadVotes();
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <CustomerToolbar onLogout={onLogout} username={username} />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {username}</h1>
        <p className="text-gray-600 mb-6">Wallet Address: {account}</p>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Available Votes</h2>
        <VoteList votes={votes} userVotes={userVotes} castVote={castVote} isAdmin={false} />
      </div>
    </div>
  );
};

export default CustomerPage;
