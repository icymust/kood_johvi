import { useState, useEffect } from "react";
import "./Profile.css";
import apiCall from "../../auth/apiCall";
import interestCategories from "../../components/InterestsSelector/InterestCategories";
import InterestsSelector from "../../components/InterestsSelector/InterestsSelector";
import PreferenceSelector from "../../components/PreferenceSelector/PreferenceSelector";
import preferenceCategories from "../../components/PreferenceSelector/PreferenceCategories.jsx";
import LocationUpdater from "../../components/LocationUpdater.jsx";
import { updatePreferences } from "../../api/profileApi.js";
import { updateProfileLocation } from "../../api/profileApi.js";

function Profile() {
  const [location, setLocation] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    aboutMe: "",
    interests: {},
    radius: 50,
    profilePicture: null,
    profilePictureUrl: "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch user profile on page load
  useEffect(() => {
    const fetchProfileAndPreferences = async () => {
      try {
        const [profileRes, preferencesRes] = await Promise.all([
          apiCall.get("/me/full-profile"),
          apiCall.get("/preferences"),
        ]);

        setFormData((prev) => ({
          ...prev,
          ...profileRes.data,
          ...preferencesRes.data,
        }));
      } catch (error) {
        console.error("Failed to load profile or preferences:", error);
      }
    };

    fetchProfileAndPreferences();
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Submit profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send profile data without the image
      await apiCall.post("/me/full-profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        age: formData.age,
        aboutMe: formData.aboutMe,
        interests: formData.interests,
        radius:formData.radius
      });

      // Send preferences in a separate API call
      await updatePreferences(
        formData.genderPreference || "",
        formData.relationshipTypes || "",
        formData.lifestylePreferences || "",
        formData.preferredLanguages || "",
        formData.minAge,
        formData.maxAge
      );

      // If image is present, send it in a second request
      if (formData.profilePicture) {
        const imageData = new FormData();
        imageData.append("profilePicture", formData.profilePicture);

        const imageUploadRes = await apiCall.post(
          "/me/profile-picture",
          imageData
        );
        setFormData((prev) => ({
          ...prev,
          profilePictureUrl: imageUploadRes.data.imageUrl,
        }));
      }

       //save location to db
       if (location && location.latitude && location.longitude) {
        try {
          await updateProfileLocation(location.latitude, location.longitude);
        } catch (error) {
          console.error("Failed to update location", error);
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      console.log("Profile saved successfully.");
    } catch (error) {
      if (error.response) {
        alert("Profile update failed: " + error.response.data);
      } else {
        alert("Error connecting to server: " + error.message);
      }
    }
  };

  useEffect(() => {
    if (formData.profilePictureUrl) {
      console.log("Profile picture URL:", formData.profilePictureUrl);
    }
  }, [formData.profilePictureUrl]);

  return (
    <>
      <div className="profilePage">
        <h1>Profile</h1>
        <form onSubmit={handleSubmit} className="inputForm">
          {formData.email && (
            <>
              <label>Username</label>
              <br />
              <div className="userEmail">{formData.email}</div>
              <br />
            </>
          )}
          <label>First Name</label>
          <br />
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="firstNameInput"
            placeholder="e.g. Crystal"
            required
          />
          <br />
          <br />
          <label>Last Name</label>
          <br />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="lastNameInput"
            placeholder="e.g. Clear"
            required
          />
          <br />
          <br />
          <label>Gender</label>
          <br />
          <label className="male">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              required
            />{" "}
            Male
          </label>
          <label className="female">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
            />{" "}
            Female
          </label>
          <br />
          <br />
          <label>Age</label>
          <br />
          <select
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="ageSelect"
            required
          >
            <option value="">Select your age</option>
            {[...Array(83)].map((_, i) => (
              <option key={i + 18} value={i + 18}>
                {i + 18}
              </option>
            ))}
          </select>
          <br />
          <br />
          <label>About Me</label>
          <br />
          <textarea
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
            rows="4"
            cols="40"
            placeholder="e.g. professional burrito eater"
            className="aboutMeInput"
            required
          />
          <br />
          <br />
          
          <InterestsSelector
            categories={interestCategories}
            value={formData.interests}
            onChange={(newValue) =>
              setFormData((prev) => ({ ...prev, interests: newValue }))
            }
          />

          <br />
          <br />
         
          {Object.entries(preferenceCategories).map(([key, options]) => (
            <div key={key}>
              <PreferenceSelector
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .replace(/^./, (char) => char.toUpperCase())}
                options={options}
                value={formData[key] || ""}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, [key]: newValue }))
                }
              />
              <br />
            </div>
          ))}
          <div className="ageRangeInputs">
            <label>Preferred Age Range</label>
            <div className="ageInputsRow">
              <input
                type="number"
                name="minAge"
                value={formData.minAge || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minAge: parseInt(e.target.value),
                  }))
                }
                placeholder="Min Age"
                min={18}
                max={formData.maxAge || 100}
              />
              <span>to</span>
              <input
                type="number"
                name="maxAge"
                value={formData.maxAge || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxAge: parseInt(e.target.value),
                  }))
                }
                placeholder="Max Age"
                min={formData.minAge || 18}
                max={100}
              />
            </div>
          </div>
          <br />
          <br />
          <br />
          <label>Profile Picture</label>
          <br />
          {formData.profilePicture ? (
            <img
              src={URL.createObjectURL(formData.profilePicture)}
              alt="Profile"
              className="profilePicturePreview"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : formData.profilePictureUrl ? (
            <img
              src={formData.profilePictureUrl}
              alt="Profile"
              className="profilePicturePreview"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : null}
          {!formData.profilePictureUrl ||
          formData.profilePictureUrl.endsWith("/uploads/default-avatar.jpg") ? (
            <label className="pictureButton fileLabel">
              Upload Profile Picture
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleChange}
                hidden
              />
            </label>
          ) : (
            <button
              type="button"
              className="pictureButton"
              onClick={async () => {
                try {
                  await apiCall.delete("/me/profile-picture");
                  setFormData((prev) => ({
                    ...prev,
                    profilePicture: null,
                    profilePictureUrl:
                      "https://localhost:8443/uploads/default-avatar.jpg",
                  }));
                } catch {
                  alert("Failed to delete profile picture");
                }
              }}
              style={{ marginTop: "10px" }}
            >
              Delete Profile Picture
            </button>
          )}
          <br />
          <br />

          <LocationUpdater onLocationChange={setLocation} />
          <br />
          <br />
          <button className="submitBtn" type="submit">
            Save Profile
          </button>
          <br />
          {saveSuccess && (
            <span className="successMessage">
              Profile saved successfully ✅
            </span>
          )}
        </form>
      </div>
    </>
  );
}

export default Profile;
