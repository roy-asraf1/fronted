import React from "react";

const LoginPage = ({ connectWallet }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Welcome to the Company Voting System
        </h1>
        <button
          onClick={connectWallet}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300"
        >
          Login with MetaMask
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
