import React, { useState, useEffect, useCallback } from "react";
import AdminToolbar from "./AdminToolbar";

const AddVotePage = ({ contract, account, username, onLogout }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [optionInput, setOptionInput] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateForm = useCallback(() => {
    const isQuestionValid = question.trim().length > 0;
    const areOptionsValid =
      options.length >= 2 && options.every((opt) => opt.trim().length > 0);
    const currentDateTime = new Date();
    const closingDateTime = new Date(closingDate);
    const isDateValid = closingDateTime > currentDateTime;

    setIsValid(isQuestionValid && areOptionsValid && isDateValid);
  }, [question, options, closingDate]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const addOption = () => {
    if (optionInput.trim() !== "") {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const deleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const createVote = async () => {
    if (!isValid) {
      alert("Please fill out all fields correctly before creating the vote.");
      return;
    }

    try {
      const closingTimestamp = Math.floor(new Date(closingDate).getTime() / 1000);
      await contract.createVote(question, options, closingTimestamp);
      setQuestion("");
      setOptions([]);
      setClosingDate("");
      alert("Vote created successfully!");
    } catch (error) {
      console.error("Error creating vote:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AdminToolbar onLogout={onLogout} username={username} />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Add Vote</h1>
        <h2 className="text-2xl text-gray-700 mb-4">Create a New Vote</h2>
        <input
          type="text"
          placeholder="Vote Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <h3 className="text-xl font-semibold text-gray-700 mb-2">Options</h3>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Add Option"
            value={optionInput}
            onChange={(e) => setOptionInput(e.target.value)}
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addOption}
            className="ml-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add Option
          </button>
        </div>
        <ul className="mb-4">
          {options.map((opt, idx) => (
            <li key={idx} className="flex justify-between items-center mb-2">
              {opt}
              <button
                onClick={() => deleteOption(idx)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mb-2">Closing Date</h3>
        <input
          type="datetime-local"
          value={closingDate}
          onChange={(e) => setClosingDate(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={createVote}
          disabled={!isValid}
          className={`w-full py-2 mt-4 font-semibold rounded-lg transition duration-300 ${
            isValid ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-400 text-gray-200"
          }`}
        >
          Create Vote
        </button>
      </div>
    </div>
  );
};

export default AddVotePage;
