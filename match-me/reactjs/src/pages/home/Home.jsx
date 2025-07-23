import "./Home.css";
import { useNavigate } from "react-router-dom";
import Login from "../login/Login.jsx";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="home-title">Match made in heaven.</h1>
      <Login />
      <p className="or">OR</p>
      <div className="btn-wrapper">
        <button
          className="new-account"
          onClick={() => navigate("/registration")}
        >
          Create new account
        </button>
      </div>
    </>
  );
}

export default Home;
