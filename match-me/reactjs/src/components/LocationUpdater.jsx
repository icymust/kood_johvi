import React, { useState, useEffect } from "react";
import LocationFetcher from "./LocationFetcher";

const LocationUpdater = ({ onLocationChange }) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: null,
  });
  const [error, setError] = useState(null);

  // Get User location from Browser using GeoLocation API
  useEffect(() => {
    const options = {
      enableHighAccuracy: true, //attempts to get more accurate position, uses GPS if available
      timeout: 10000, //waits 5 sec max for the location to be retrieved
      maximumAge: 0, // always fetches the latest position, does not use the cached one
    };

    const tryGetLocation = (retries = 2) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });

            // Use LocationFetcher to fetch the address based on coordinates
            let address = null;
            try {
              address = await LocationFetcher(latitude, longitude);
            } catch (e) {
              console.warn("Failed to fetch address:", e);
            }

            setLocation((prevLocation) => ({ ...prevLocation, address }));
            onLocationChange({ latitude, longitude, address }); // This still runs when aadress fetching fails
          },
          (err) => {
            if (retries > 0) {
              console.warn("Location error, retrying...", err.message);
              setTimeout(() => tryGetLocation(retries - 1), 2000);
            } else {
              let errorMessage = "Geolocation error occurred.";
              let shouldShowError = false;
              switch (err.code) {
                case err.PERMISSION_DENIED:
                  errorMessage = "Permission denied. Enable location services.";
                  shouldShowError = true;
                  break;
                case err.POSITION_UNAVAILABLE:
                  errorMessage = "Location unavailable.";
                  console.error(errorMessage);
                  break;
                case err.TIMEOUT:
                  errorMessage = "Location request timed out.";
                  console.error(errorMessage);
                  break;
                default:
                  errorMessage = "Unknown location error.";
                  console.error(errorMessage);
              }
              if (shouldShowError) {
                setError(errorMessage);
              }

              // Fallback: try to get location based on IP
              fetch("https://ipapi.co/json/")
                .then((res) => res.json())
                .then(async (data) => {
                  if (data.latitude && data.longitude) {
                    const { latitude, longitude } = data;
                    setLocation({
                      latitude: data.latitude,
                      longitude: data.longitude,
                    });

                    let address = null;
                    try {
                      address = await LocationFetcher(latitude, longitude);
                    } catch (e) {
                      console.warn("Failed to fetch address:", e);
                    }

                    setLocation((prevLocation) => ({
                      ...prevLocation,
                      address,
                    }));
                    onLocationChange({ latitude, longitude, address });
                  } else {
                    setError("Failed to get location from IP.");
                  }
                })
                .catch(() => {
                  console.error("IP location fallback failed.");
                  setError("IP location fallback failed.");
                });
            }
          },
          options
        );
      } else {
        setError("Geolocation is not supported by your browser.");
      }
    };

    tryGetLocation(2); // runs when userId changes or on first render
  }, [onLocationChange]); // runs when userId changes or on first render

  return (
    <div>
      <h3>Location</h3>
      {!location.latitude && !location.longitude && error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : null}

      {/* Show user location if available */}
      {location.latitude && location.longitude ? (
        <div>{location.address && <p>{location.address}</p>}</div>
      ) : (
        <p>Fetching your location...</p>
      )}
    </div>
  );
};

export default LocationUpdater;
