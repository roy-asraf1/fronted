// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import AddVotePage from "./components/AddVotePage";
import ExistingVotesPage from "./components/ExistingVotesPage";
import SettingsPage from "./components/SettingsPage";
import CustomerPage from "./components/CustomerPage";
import CustomerNewVotesPage from "./components/CustomerNewVotesPage";
import CustomerClosedVotesPage from "./components/CustomerClosedVotesPage";
import CustomerSettingsPage from "./components/CustomerSettingsPage";
import AddUserPage from "./components/AddUserPage";
import CompanyAccountPage from "./components/CompanyAccountPage";
import ManagerApprovalPage from "./components/ManagerApprovalPage";
import ManagerTransactionHistoryPage from "./components/ManagerTransactionHistoryPage";
import CustomerRequestCreationPage from "./components/CustomerRequestCreationPage";
import CustomerRequestStatusPage from "./components/CustomerRequestStatusPage";
import VotingSystem from "./contracts/VotingSystem.json";

function App() {
  // Remove unused 'provider' state
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          // Remove unused provider initialization
          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        } catch (err) {
          console.error("Error initializing provider", err);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const tmpProvider = new BrowserProvider(window.ethereum);
      const signer = await tmpProvider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      console.log("Connected account:", address);
  
      // Use environment variable for the contract address
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  
      const tmpContract = new Contract(contractAddress, VotingSystem.abi, signer);
      setContract(tmpContract);
  
      // Fetch the role from the contract
      let role;
      try {
        role = await tmpContract.getUserRole(address);
      } catch (err) {
        console.error("Error fetching user role:", err);
        alert("Error: Your account may not be authorized.");
        return;
      }
  
      console.log("User Role:", role);
  
      const user = await tmpContract.authorizedUsers(address);
      console.log("User Details:", user);
      setUsername(user.username);
  
      // Convert role to a number for comparison
      const roleNumber = Number(role);
      console.log("User Role:", roleNumber);
      setUserRole(roleNumber);
    } catch (err) {
      if (err.code === -32603 || err.message.includes("User is not authorized")) {
        console.error(
          "Account is not authorized in the smart contract. Please check account permissions."
        );
        alert(
          "Your account is not authorized to access this application. Please use an authorized account."
        );
      } else {
        console.error("Error connecting wallet or fetching user role:", err);
      }
    }
  };
  

  const onLogout = () => {
    setAccount("");
    setUserRole(null);
    setUsername("");
    navigate("/");
    window.location.reload();
  };

  if (!account) {
    return <LoginPage connectWallet={connectWallet} />;
  }

  return (
    <Routes>
      {userRole === 1 ? (
        <>
          {/* Admin Routes */}
          <Route
            path="/admin/home"
            element={
              <AdminPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/admin/add-vote"
            element={
              <AddVotePage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/admin/existing-votes"
            element={
              <ExistingVotesPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/admin/settings"
            element={
              <SettingsPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <AddUserPage 
                contract={contract} 
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/admin/company-account"
            element={
              <CompanyAccountPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/admin/approval-requests"
            element={
              <ManagerApprovalPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/admin/transaction-history"
            element={
              <ManagerTransactionHistoryPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route path="*" element={<Navigate to="/admin/home" />} />
        </>
      ) : userRole === 2 ? (
        <>
          {/* Customer Routes */}
          <Route
            path="/customer/home"
            element={
              <CustomerPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/customer/new-votes"
            element={
              <CustomerNewVotesPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/customer/closed-votes"
            element={
              <CustomerClosedVotesPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/customer/create-request"
            element={
              <CustomerRequestCreationPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/customer/request-status"
            element={
              <CustomerRequestStatusPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route
            path="/customer/settings"
            element={
              <CustomerSettingsPage
                contract={contract}
                account={account}
                username={username}
                onLogout={onLogout}
              />
            }
          />
          <Route path="*" element={<Navigate to="/customer/home" />} />
        </>
      ) : (
        <>
          <Route path="*" element={<LoginPage connectWallet={connectWallet} />} />
        </>
      )}
    </Routes>
  );
}

export default App;
