import axios from 'axios';

// Fallback location using IP-based API if OpenStreetMap fails
const fallbackLocation = async () => {
  try {
    const response = await axios.get(`https://ipapi.co/json/`);
    const { city, country_name: country } = response.data;
    if (city || country) {
      return `${city || ''}, ${country || ''}`;
    }
    return "Location not found";
  } catch (error) {
    console.error("Fallback location error:", error);
    return "Error fetching location";
  }
};

// Main location fetcher function using OpenStreetMap
const LocationFetcher = async (latitude, longitude) => {
  const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

  try {
    const response = await axios.get(geocodeUrl, {
      headers: {
        'Accept-Language': 'en', // Ensure consistent language
      },
    });

    const data = response.data;
    const address = data?.address;

    if (address) {
      // Try multiple levels of locality, fallback in order of importance
      const cityLike = address.city ||
                       address.town ||
                       address.village ||
                       address.hamlet ||
                       address.municipality ||
                       address.county; // Final fallback before giving up

      const country = address.country || '';
      if (cityLike || country) {
        return `${cityLike || ''}, ${country}`;
      }
    }

    // Fallback if the address is incomplete or missing
    return "Location not found";
  } catch (error) {
    console.error("Error fetching location:", error);

    // If OpenStreetMap fails, try fallback location based on IP
    return fallbackLocation(latitude, longitude);
  }
};

export default LocationFetcher;
