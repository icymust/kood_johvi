import apiCall from "../auth/apiCall";

// Function to fetch connections for a user
export const getUserConnections = async () => {
  try {
    const response = await apiCall.get(`/connections`);
    console.log("Connections for user:", response.data);
    return response.data; // return grouped by status
  } catch (error) {
    console.error("Error fetching connections for user", error.message);
    throw error;
  }
};

// Function to send a connection request
export const createConnection = async (recommendedUserId, newStatus) => {
  try {
    const payload = { recommendedUserId, status: newStatus };
    console.log("Sending connection request:", payload);
    const response = await apiCall.post(`/connections`, payload);
    console.log("Connection request sent successfully", response.data);
  } catch (error) {
    console.error("Error creating connection:", error);
    throw error; // Re-throw to handle it in the component
  }
};

// Update the status of a connection (e.g. Accept/Reject)
export const updateConnectionStatus = async (recommendedUserId, newStatus) => {
  try {
    const payload = { recommendedUserId, status: newStatus };
    const response = await apiCall.put(`/connections`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating connection status:", error);
    throw error;
  }
};
