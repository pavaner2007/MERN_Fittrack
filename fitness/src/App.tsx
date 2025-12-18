import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import SimpleChatbot from "./components/SimpleChatbot";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WalkTime from "./pages/WalkTime";
import Workouts from "./pages/Workouts";
import AddWorkout from "./pages/AddWorkout";
import Profile from "./pages/Profile";

function Layout() {
  const location = useLocation();
  const hideNavbarOn = ["/", "/login", "/register"];

  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/walk" element={<WalkTime />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/add-workout" element={<AddWorkout />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {!shouldHideNavbar && <SimpleChatbot />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}