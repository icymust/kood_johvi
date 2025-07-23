import { useState, useEffect } from "react";
import { getProfileRadius, updateProfileRadius } from "../api/profileApi"; // Import the updateProfileRadius API call

const RadiusInput = ({ radius, onRadiusChange }) => {
  const [localRadius, setLocalRadius] = useState(radius);
  const [debouncedRadius, setDebouncedRadius] = useState(radius); // To store the debounced radius

  // Fetch radius from backend if needed (optional)
  useEffect(() => {
    if (radius === null) {
      const fetchRadius = async () => {
        try {
          const r = await getProfileRadius();
          setLocalRadius(r); // Set the initial value from the server
        } catch {
          console.error("Failed to fetch radius from server");
        }
      };
      fetchRadius();
    }
  }, [radius]); // Run effect only if radius is null

  useEffect(() => {
    setLocalRadius(radius); // Sync with parent when radius prop changes
  }, [radius]);

  // Debounce the radius update
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update the debounced radius after the delay
      setDebouncedRadius(localRadius);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer); // Clear the previous timeout if the radius changes again before the delay
    };
  }, [localRadius]); // Effect runs when localRadius changes

  useEffect(() => {
    if (debouncedRadius !== radius) {
      // Update radius on the server when debounced radius changes
      const updateRadius = async () => {
        try {
          await updateProfileRadius(debouncedRadius); // Update radius on the server
          onRadiusChange(debouncedRadius); // Notify the parent component of the new radius
        } catch (error) {
          console.error("Failed to update radius on server", error);
        }
      };

      updateRadius();
    }
  }, [debouncedRadius, radius, onRadiusChange]); // Effect runs when debouncedRadius changes

  const handleRadiusChange = (event) => {
    const newRadius = event.target.value;
    setLocalRadius(newRadius); // Update the local radius immediately
  };

  return (
    <div className="radiusInput">
      <label className="radiusLabel">Max Distance: {localRadius} km</label>
      <input
        type="range"
        name="radius"
        min="0"
        max="300"
        value={localRadius || 0}
        onChange={handleRadiusChange}
        className="maxDistanceInput"
      />
    </div>
  );
};

export default RadiusInput;
