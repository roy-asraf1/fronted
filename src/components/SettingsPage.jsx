import React, { useState, useEffect } from "react";
import AdminToolbar from "./AdminToolbar";

const SettingsPage = ({ contract, account, username, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userAddresses = await contract.getAllUsers();
        const userDetails = await Promise.all(
          userAddresses.map(async (address) => {
            const name = await contract.getUsername(address);
            const role = await contract.getUserRole(address);
            const roleNumber = Number(role);
            return {
              address,
              name,
              role: roleNumber === 1 ? "Manager" : "Customer",
            };
          })
        );
        setUsers(userDetails);
        setFilteredUsers(userDetails);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      }
    };

    if (contract) {
      fetchUsers();
    }
  }, [contract]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const removeUser = async (address) => {
    try {
      await contract.removeUser(address);
      setSuccess("User removed successfully!");
      setUsers(users.filter((user) => user.address !== address));
      setFilteredUsers(filteredUsers.filter((user) => user.address !== address));
    } catch (err) {
      console.error("Error removing user:", err);
      setError("Failed to remove user.");
    }
  };

  const promoteToAdmin = async (address) => {
    try {
      // In practice, you'd call a contract function to promote the user. Here we're simulating it:
      setSuccess("User promoted to admin successfully!");
      setUsers(
        users.map((user) =>
          user.address === address ? { ...user, role: "Manager" } : user
        )
      );
      setFilteredUsers(
        filteredUsers.map((user) =>
          user.address === address ? { ...user, role: "Manager" } : user
        )
      );
    } catch (err) {
      console.error("Error promoting user:", err);
      setError("Failed to promote user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AdminToolbar onLogout={onLogout} username={username} />
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Admin Settings</h1>
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <table className="w-full bg-blue-50 rounded-lg shadow-sm mb-6">
          <thead>
            <tr className="text-left text-gray-700">
              <th className="p-4">Username</th>
              <th className="p-4">Address</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.address} className="border-b border-gray-200">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.address}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  {user.role === "Customer" && (
                    <button
                      onClick={() => promoteToAdmin(user.address)}
                      className="mr-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                    >
                      Promote to Admin
                    </button>
                  )}
                  <button
                    onClick={() => removeUser(user.address)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsPage;
