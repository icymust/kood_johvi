import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getFullNameAndPicture,
  getBio,
  getRecommendations,
} from "../../api/profileApi";
import { createConnection } from "../../api/connectionApi";
import "./Recommendations.css";
import RadiusInput from "../../components/RadiusInput";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [inputRadius, setInputRadius] = useState(50); // Added state for the radius

  const fetchRecommendationsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const recommendationIds = await getRecommendations();

      const userProfiles = await Promise.all(
        recommendationIds.map(async (recommendedUserId) => {
          const [fullNameAndPictureData, bioData] = await Promise.all([
            getFullNameAndPicture(recommendedUserId),
            getBio(recommendedUserId),
          ]);

          return {
            ...fullNameAndPictureData,
            ...bioData,
          };
        })
      );

      setRecommendations(userProfiles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError(error.message);
      console.error(error.message);
      setLoading(false); // The backend-sent message will show here
    }
  }, []);

  const handleConnect = async (recommendedUserId) => {
    try {
      const response = await createConnection(recommendedUserId, "REQUESTED");
      setRecommendations((prev) =>
        prev.filter((profile) => profile.userId !== recommendedUserId)
      );
      console.log("Connection request successful:", response);
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Failed to send connection request.");
    }
  };

  const handleDiscard = async (recommendedUserId) => {
    const confirmed = window.confirm(
      "Are you sure you want to discard this recommendation?"
    );
    if (confirmed) {
      try {
        await createConnection(recommendedUserId, "REJECTED");
        setRecommendations((prev) =>
          prev.filter((profile) => profile.userId !== recommendedUserId)
        );
      } catch (error) {
        console.error("Error discarding recommendation:", error);
      }
    }
  };

  useEffect(() => {
    fetchRecommendationsData();
  }, [fetchRecommendationsData, refreshKey]);

  if (error)
    return (
      <div className="errorMessage">
        <span>{error}</span>
      </div>
    );

  return (
    <div className="recommendationsPage">
      <h1>Recommendations</h1>
      {error && (
        <div className="errorMessage">
          <span>{error}</span>
        </div>
      )}
      <div className="recoSettings">
        <button
          onClick={() => setRefreshKey((prevKey) => prevKey + 1)}
          className="refreshButton"
        >
          Update Recommendations
        </button>
        <RadiusInput
          radius={inputRadius} // Pass radius to RadiusInput component
          onRadiusChange={setInputRadius} // Pass the set function to handle radius change
          className="radiusInput"
        />
      </div>
      {loading && recommendations.length === 0 ? (
        <div>Loading...</div>
      ) : recommendations.length === 0 ? (
        <p>No recommendations available</p>
      ) : (
        <div>
          <ul className="recommendationsList">
            {recommendations.map((profile) => (
              <li key={profile.userId} className="recommendationItem">
                <div className="profilePictureBox">
                  <img
                    src={profile.profilePictureUrl}
                    alt={`${profile.firstName}'s profile`}
                    className="profilePicturePreview"
                  />
                </div>

                <div className="profileDetails">
                  <Link to={`/profiles/${profile.userId}`} className="fullName">
                    {profile.firstName} {profile.lastName}
                  </Link>
                  <div className="profileField">
                    <span className="rProfileLabel">Age:</span>
                    <span className="rProfileValue">{profile.age}</span>
                  </div>
                  <div className="profileField">
                    <span className="rProfileLabel">Gender:</span>
                    <span className="rProfileValue">{profile.gender}</span>
                  </div>
                  <div className="profileField">
                    <span className="rProfileLabel">About Me:</span>
                    <span className="rProfileValue">{profile.aboutMe}</span>
                  </div>

                  <div className="recoButtons">
                    <button
                      onClick={() => handleConnect(profile.userId)}
                      className="recoConnect"
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => handleDiscard(profile.userId)}
                      className="recoReject"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
