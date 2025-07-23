import React, { useState, useEffect } from "react";

import {
  getUserConnections,
  updateConnectionStatus,
} from "../../api/connectionApi.js";
import ConnectionList from "../../components/ConnectionList/ConnectionList.jsx";
import "./Connections.css";

const Connections = () => {
  // State for categorized connection lists
  const [connections, setConnections] = useState({
    accepted: [],
    sentRequests: [],
    receivedRequests: [],
  });

  const [activeTab, setActiveTab] = useState("accepted"); // Current tab
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading indicator

  // Fetch user connections when component mounts or userId changes
  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserConnections(); // API call
        setConnections(data); // Set categorized connection data
      } catch (err) {
        console.error("Error fetching connections:", err);
        setError("Failed to fetch connections. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
    setLoading(false);
  }, []);

  // Handle status updates (e.g., Accept or Reject)
  const handleStatusUpdate = async (otherUserId, newStatus) => {
    try {
      await updateConnectionStatus(otherUserId, newStatus);

      setConnections((prev) => {
        const updated = { ...prev };
        for (const key in updated) {
          updated[key] = updated[key].filter((id) => id !== otherUserId);
        }
        if (newStatus === "ACCEPTED") {
          updated.accepted.push(otherUserId);
        }
        return updated;
      });
    } catch (error) {
      console.error(`Error updating connection status to ${newStatus}:`, error);
      alert("Failed to update connection status.");
    }
  };

  // Render a user list for the current tab
  const renderUserList = (list, tab) => {
    if (!list || list.length === 0) {
      return <p>No users in this category</p>;
    }

    return (
      <ul className="connectionList">
        {list.map((id) => (
          <ConnectionList
            key={id}
            userId={id}
            tab={tab}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </ul>
    );
  };

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // UI with tab switching and dynamic user list rendering
  const tabs = [
    { label: "Accepted", key: "accepted" },
    { label: "Sent Requests", key: "sentRequests" },
    { label: "Received Requests", key: "receivedRequests" },
  ];

  return (
    <div className="connectionsPage">
      <h1>Connections</h1>
      <div className="tabs">
        {tabs.map(({ label, key }) => (
          <button
            key={key}
            className={`tabButton ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
            disabled={activeTab === key}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Render user list based on active tab */}
      {renderUserList(connections[activeTab], activeTab)}
    </div>
  );
};

export default Connections;
