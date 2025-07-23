import apiCall from "../auth/apiCall";

const API_URL = "https://localhost:8443/api/status";

export const setOnlineStatus = async (isOnline) => {
   try {
      await apiCall.post(`${API_URL}/${isOnline ? "online" : "offline"}`, {
            headers: { "Content-Type": "application/json" },
      });
   } catch (error) {
      console.error("Error updating online status:", error);
   }
};