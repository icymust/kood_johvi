import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Registration from "./pages/registration/Registration.jsx";
import Login from "./pages/login/Login.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Home from "./pages/home/Home.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Chat from "./pages/chatPage.jsx";
import ChatList from "./pages/chatListPage.jsx";
import Recommendations from "./pages/recommendations/Recommendations.jsx";
import Connections from "./pages/connections/Connections.jsx";
import ConnectedProfile from "./pages/connected-profile/ConnectedProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "registration", element: <Registration /> },
      { path: "login", element: <Login /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "chat", element: <Chat /> },
          { path: "chatList", element: <ChatList /> },
          { path: "recommendations", element: <Recommendations /> },
          { path: "connections", element: <Connections /> },
          { path: "profiles/:userId", element: <ConnectedProfile /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
