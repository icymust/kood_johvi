import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFullNameAndPicture } from "../../api/profileApi";
import { getBio } from "../../api/profileApi";
import LocationFetcher from "../LocationFetcher";
import "./ConnectionList.css";

const ConnectionList = ({ userId, tab, onStatusUpdate }) => {
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch name and picture
        const fullNameAndPicture = await getFullNameAndPicture(userId);
        // Fetch additional details
        const bio = await getBio(userId);

        // Combine the fetched data into a single object
        setUserData({
          ...fullNameAndPicture,
          ...bio,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    // Fetch location after user data is loaded
    if (userData && userData.latitude && userData.longitude) {
      const fetchLocation = async () => {
        const location = await LocationFetcher(
          userData.latitude,
          userData.longitude
        );
        setLocation(location); // Store the location in state
      };

      fetchLocation();
    }
  }, [userData]);

  const handleClick = (status) => {
    if (status === "DISCONNECTED") {
      const confirmed = window.confirm("Are you sure you want to disconnect?");
      if (!confirmed) return;
    } else if (status === "REJECTED") {
      const confirmed = window.confirm(
        "Are you sure you want to reject the request?"
      );
      if (!confirmed) return;
    }
    onStatusUpdate(userId, status);
  };

  if (!userData) return <li>Loading...</li>;

  return (
    <li className="connectionItem">
      <div className="profilePictureBox">
        <img
          src={userData.profilePictureUrl}
          alt="Profile"
          className="profilePicturePreview"
        />
      </div>
      <div>
        {/* Name as a clickable link */}
        <Link
          to={`/profiles/${userId}`}
          style={{ fontWeight: "bold" }}
          className="connectedProfileName"
        >
          {userData.firstName} {userData.lastName}
        </Link>
        <div style={{ fontSize: "0.9rem", color: "#555" }}>
          <p>
            <span className="cProfileLabel">Age:</span>{" "}
            <span className="cProfileValue">{userData.age}</span>
          </p>
          <p>
            <span className="cProfileLabel">Gender:</span>{" "}
            <span className="cProfileValue">{userData.gender}</span>
          </p>
          <p>
            <span className="cProfileLabel">About Me:</span>{" "}
            <span className="cProfileValue">{userData.aboutMe}</span>
          </p>
          {/* Location display */}
          <p>
            <span className="cProfileLabel">Location:</span>{" "}
            <span className="cProfileValue">
              {location ? location : "Loading location..."}
            </span>
          </p>
        </div>

        <div className="btnSection">
          {tab === "receivedRequests" && (
            <>
              <button
                type="button"
                onClick={() => handleClick("ACCEPTED")}
                style={{ marginLeft: "1rem" }}
                className="cAcceptBtn"
                aria-label={`Accept connection from ${userData.firstName}`}
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => handleClick("REJECTED")}
                style={{ marginLeft: "0.5rem" }}
                className="cDisconnectBtn"
                aria-label={`Reject connection from ${userData.firstName}`}
              >
                Reject
              </button>
            </>
          )}
          {tab === "accepted" && (
            <button
              type="button"
              onClick={() => handleClick("DISCONNECTED")}
              // style={{ marginLeft: "1rem" }}
              className="cDisconnectBtn"
              aria-label={`Disconnect from ${userData.firstName}`}
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default ConnectionList;
