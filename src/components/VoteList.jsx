import React from "react";


const VoteList = ({ votes, closeVote, castVote, userVotes, isAdmin }) => {
  return (
    <div className="space-y-4">
      {votes.map((vote, idx) => (
        <div
          key={idx}
          className="border border-gray-300 p-4 rounded-lg shadow-md bg-white"
        >
          <h3 className="text-xl font-semibold text-gray-700">{vote.question}</h3>
          <p className="text-gray-500">Closing Date: {new Date(vote.closingDate * 1000).toString()}</p>
          <p className={`mt-2 ${vote.isOpen ? 'text-green-500' : 'text-red-500'}`}>
            Status: {vote.isOpen ? "Open" : "Closed"}
          </p>
          <h4 className="text-gray-600 mt-4">Options:</h4>
          <ul className="mt-2 space-y-2">
            {vote.options.map((opt, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
              >
                <span>{opt} - Votes: {vote.votesPerOption[index]}</span>
                {!isAdmin && vote.isOpen && !userVotes[vote.id] && (
                  <button
                    onClick={() => castVote(vote.id, index)}
                    className="ml-2 px-4 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Vote
                  </button>
                )}
              </li>
            ))}
          </ul>
          {isAdmin && vote.isOpen && (
            <button
              onClick={() => closeVote(vote.id)}
              className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
            >
              Close Vote
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default VoteList;
