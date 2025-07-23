import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import axios from "axios";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent full page reload

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setEmailError("");
      navigate("/login?registered=true");
    } catch (error) {
      if (error.response) {
        if (error.response.data.message === "Email already registered") {
          setEmailError("An account with this email already exists.");
          setTimeout(() => setEmailError(""), 5000);
        } else {
          alert("Registration failed: " + error.response.data.message);
        }
      } else {
        alert("Error connecting to server: " + error.message);
      }
    }
  };

  return (
    <div className="registration-wrapper">
      <div className="registration-container">
        <h1>Register Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="email">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              required
              placeholder="e.g. john.smith@matchme.com"
            />
            {emailError && <span className="email-error">{emailError}</span>}
          </div>

          <div className="password">
            <div className="password-label-row">
              <label htmlFor="password">Password:</label>
              {passwordError && (
                <span className="password-error">{passwordError}</span>
              )}
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                if (value === "") {
                  setPasswordError("");
                } else if (value.length < 6) {
                  setPasswordError("Password must be at least 6 characters.");
                } else {
                  setPasswordError("");
                }
              }}
              required
              placeholder="e.g. !k7TReM9p?CtQsHsc?dG@oC5h69$"
            />
          </div>

          <div className="password">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="e.g. !k7TReM9p?CtQsHsc?dG@oC5h69$"
            />
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
