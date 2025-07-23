import apiCall from "../auth/apiCall";

//fetch user's name and link to the profile picture
export const getFullNameAndPicture = async (requestedUsersId) => {
  try {
    const response = await apiCall.get(`/users/${requestedUsersId}`);

    const { userId, firstName, lastName, profilePictureUrl } = response.data;
    return { userId, firstName, lastName, profilePictureUrl };
  } catch (error) {
    console.error(
      "Error fetching user's name and profile picture",
      error.message
    );
    throw error;
  }
};

//fetch user's age, gender, about me and location
export const getBio = async (requestedUsersId) => {
  try {
    const response = await apiCall.get(`/users/${requestedUsersId}/bio`);
    const { userId, age, gender, aboutMe, latitude, longitude } = response.data;
    return { userId, age, gender, aboutMe, latitude, longitude };
  } catch (error) {
    console.error(
      "Error fetching user's age, gender and about me",
      error.message
    );
    throw error;
  }
};

export const getRecommendations = async () => {
  try {
    const response = await apiCall.get(`/recommendations`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response", error.response); // Log full error response for debugging
      
      // Check if the error response contains a message field
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message); // Pass the message from the backend
      } else {
        throw new Error("Error fetching recommendations"); // Default message if no message is in the response
      }
    } else {
      console.error("Error without response", error);
      throw new Error("Unknown error occurred");
    }
  }
};

//update users location
export const updateProfileLocation = async (latitude, longitude) => {
  try {
    const payload = { latitude, longitude };
    console.log("Sending location update:", payload);
    const response = await apiCall.put(`/location`, payload);
    console.log("Location updated successfully", response.data);
  } catch (error) {
    console.error("Error updating location", error);
    throw error;
  }
};

//update radius in user profile
export const updateProfileRadius = async (radius) => {
  try {
    const payload = { radius };
    console.log("Sending radius update:", payload);
    const response = await apiCall.put(`/radius`, payload);
    console.log("Radius updated successfully", response.data);
  } catch (error) {
    console.error("Error updating radius", error);
    throw error;
  }
};

//fetch radius for current user
export const getProfileRadius = async () => {
  const response = await apiCall.get(`/radius`);
  return response.data;
};

//update users preferences
export const updatePreferences = async (
  genderPreference,
  relationshipTypes,
  lifestylePreferences,
  preferredLanguages,
  minAge,
  maxAge
) => {
  try {
    const payload = {
      genderPreference,
      relationshipTypes,
      lifestylePreferences,
      preferredLanguages,
      minAge,
      maxAge,
    };
    console.log("Sending preferences update:", payload);
    const response = await apiCall.post(`/preferences`, payload);
    console.log("Preferences updated successfully", response.data);
  } catch (error) {
    console.error("Error updating preferences", error);
    throw error;
  }
};
