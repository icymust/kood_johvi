import apiCall from "../auth/apiCall";

const API_URL = "https://localhost:8443/api/messages";

export const getMessages = async (chatId, page = 0) => {
    try {
        const response = await apiCall.get(`${API_URL}/${chatId}?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Error to receive message:", error);
        return { content: [], last: true };
    }
};

export const sendMessage = async (receiverId, content) => {
    try {
        await apiCall.post(`${API_URL}/send`, {
            receiverId,
            content,
        });
    } catch (error) {
        console.error("Error to send message:", error);
    }
};
