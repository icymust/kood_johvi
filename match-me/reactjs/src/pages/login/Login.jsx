import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import apiCall, { setAccessToken as setApiToken } from "../../auth/apiCall";
import { useAuth } from "../../auth/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent full page reload
    console.log("Logging in with user: " + email);

    try {
      const response = await apiCall.post(
        "/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true, // Required for refreshToken cookie!
        }
      );

      const { accessToken } = response.data;

      if (!accessToken) {
        alert("Login failed: No access token received.");
        return;
      }

      // Store token
      setAccessToken(accessToken);
      setApiToken(accessToken);
      console.log("Successfully stored accessToken: " + accessToken);

      // Clear form
      setEmail("");
      setPassword("");

      // Check profile completion
      try {
        const profileRes = await apiCall.get("/me/full-profile");
        const profile = profileRes.data;

        const isComplete =
          profile &&
          profile.firstName &&
          profile.lastName &&
          profile.age &&
          profile.gender;

        if (isComplete) {
          navigate("/connections");
        } else {
          navigate("/profile");
        }
      } catch (profileErr) {
        console.error("Failed to fetch profile:", profileErr);
        navigate("/profile"); // fallback
      }
    } catch (error) {
      if (error.response) {
        alert("Login failed: " + error.response.data);
      } else {
        alert("Error connecting to server: " + error.message);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="email">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. john.smith@matchme.com"
            />
          </div>

          <div className="password">
            <div className="password-label-row">
              <label htmlFor="password">Password:</label>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              placeholder="e.g. !k7TReM9p?CtQsHsc?dG@oC5h69$"
            />
          </div>

          <button type="submit" className="submit-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
