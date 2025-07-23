import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateConnectionStatus, getUserConnections } from "../../api/connectionApi";
import "./ConnectedProfile.css";
import apiCall from "../../auth/apiCall";
import LocationFetcher from "../../components/LocationFetcher";
import { getUserChats } from "../../api/chatApi"; 

export default function ConnectedProfile() {
  const { userId } = useParams();
  const navigate = useNavigate(); // Add navigation hook
  const [isDisconnected, setIsDisconnected] = useState(false); // State to track disconnection
  const [isConnectionAccepted, setIsConnectionAccepted] = useState(false); // State connect status for chat btn
  const [formData, setFormData] = useState({
    user: "",
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    aboutMe: "",
    interests: {},
    preferences: "",
    profilePictureUrl: "",
    latitude: 0,
    longitude: 0,
    address: "",
  });

  // Fetch user profile on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiCall.get(`/profiles/${userId}`);
        const data = res.data;
        setFormData((prev) => ({
          ...prev,
          ...res.data,
        }));
        // Fetch and set address from coordinates
      if (data.latitude && data.longitude) {
        const fetchedAddress = await LocationFetcher(data.latitude, data.longitude);
        setFormData((prev) => ({
          ...prev,
          address: fetchedAddress,
        }));
      }
      // Fetch onlineCount from chat API
      const chats = await getUserChats();
      const userChat = chats.find((chat) => chat.chatPartnerId === userId);
      setFormData((prev) => ({
        ...prev,
        onlineCount: userChat ? userChat.onlineCount : 0,
      }));
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const connections = await getUserConnections();
        const acceptedConnections = connections.accepted || [];
        setIsConnectionAccepted(acceptedConnections.includes(userId));
      } catch (error) {
        console.error("Failed to check connection status:", error);
      }
    };

    checkConnectionStatus();
  }, [userId]);

  const handleClick = () => {
    const confirmed = window.confirm("Are you sure you want to disconnect?");
    if (!confirmed) return;

    // Update the connection status to "DISCONNECTED" and set the state
    updateConnectionStatus(userId, "DISCONNECTED")
      .then(() => {
        setIsDisconnected(true); // Set to disconnected after confirmation
      })
      .catch((error) => {
        console.error("Failed to disconnect:", error);
      });
  };

  // Function to format and display the interests as key-value pairs with proper spacing
  const renderInterests = (interests) => {
    return Object.entries(interests).map(([key, value], index) => {
      // Join array values into a comma-separated string
      const formattedValue = value.join(", ");

      return (
        <div key={index} className="profileField">
          <span className="profileLabel">
            {key.charAt(0).toUpperCase() + key.slice(1)}:
          </span>
          <span className="profileValue">{formattedValue}</span>
        </div>
      );
    });
  };

  //btn go to chat
  const handleGoToChat = async () => {
    try {
      const chats = await getUserChats(); // chat list
      const existingChat = chats.find(
        (chat) => chat.chatPartnerId === userId // check chat with user
      );

      if (existingChat) {
        navigate(`/chatList?chatId=${existingChat.chatId}`); // redirect to history
      } else {
        // if chat is not exist, send "Hello, let's chat!"
        const message = {
          receiverId: userId,
          content: "Hello, let's chat!",
        };

        try {
          const newChat = await apiCall.post("/api/messages/send", message);
          // alert("Message sent successfully! Redirecting to chat...");
          navigate(`/chatList?chatId=${newChat.data.chatId}`); // redirect to ne chat
        } catch (error) {
          console.error("Failed to send message:", error);
          alert("Failed to send message. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error to reach a chat:", error);
      alert("Try again to open chat.");
    }
  };

  return (
    <>
      <div className="matchPage">
        <h1>Connected Profile</h1>
        <div className="fullProfileSection">
          <div className="profilePictureBox">
            <img
              src={formData.profilePictureUrl || null}
              alt="Profile"
              className="profilePicturePreview"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <div className="profileTextBox">
            <div className="fullName">
              {formData.firstName} {formData.lastName}
              <span style={{ marginLeft: "0.5rem" }}>
                {formData.onlineCount > 0 ? "🟢" : "🔴"}
              </span>
            </div>
            <div className="btnSection">
              {!isDisconnected && (
                <>
                  <button
                    className="disconnectBtn"
                    type="button"
                    onClick={() => handleClick()}
                    style={{ marginLeft: "1rem" }}
                    aria-label={`Disconnect from ${formData.firstName}`}
                  >
                    Disconnect
                  </button>
                  <button
                    className="helloBtn"
                    onClick={handleGoToChat}
                    style={{
                      marginLeft: "1rem",
                      pointerEvents: isConnectionAccepted ? "auto" : "none", // Блокируем клики, если соединение не ACCEPTED
                      opacity: isConnectionAccepted ? 1 : 0.5, // Визуально показываем, что кнопка отключена
                    }}
                    disabled={!isConnectionAccepted} // Кнопка активна только если соединение ACCEPTED
                  >
                    Go to Chat
                  </button>
                </>
              )}
            </div>
            <br />
            {isDisconnected ? (
              <p style={{ color: "gray", fontSize: "1.1rem" }}>
                You are disconnected from this user.
              </p>
            ) : (
              <>
                <div className="profileField">
                  <span className="profileLabel">Age:</span>
                  <span className="profileValue">{formData.age}</span>
                </div>
                <div className="profileField">
                  <span className="profileLabel">Gender:</span>
                  <span className="profileValue">{formData.gender}</span>
                </div>
                <div className="profileField">
                  <span className="profileLabel">About:</span>
                  <span className="profileValue">{formData.aboutMe}</span>
                </div>
                <div className="profileField">
                  <span className="profileLabel">Location:</span>
                  <span className="profileValue">{formData.address}</span>
                </div>
                {/* Render Interests */}
                <div className="profileField">
                  <div className="profileValue">
                    {renderInterests(formData.interests)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
