import apiCall from "../auth/apiCall";

const API_URL = "https://localhost:8443/api/chats";

export const getUserChats = async () => {
    try {
        const response = await apiCall.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Get chats err:", error);
        return [];
    }
};
