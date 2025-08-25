import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import App from "./App"; // Course Management
import StudentRegistration from "./StudentRegistration";
import MarkManagement from "./MarkManagement";
import "./Main.css";

function Main() {
  return (
    <Router>
      <nav
        className="navbar px-4 shadow-sm"
        style={{
          background: "linear-gradient(90deg, #0d6efd, #6610f2)",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
        }}
      >
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <span className="navbar-brand text-white fw-bold fs-4">
            🎓 Uni Dashboard
          </span>

          <div className="btn-group">
            <Link to="/" className="btn nav-btn me-2 btn-outline-light text-white">
              Course Management
            </Link>
            <Link
              to="/students"
              className="btn nav-btn me-2 btn-outline-light text-white"
            >
              Student Registration
            </Link>
            <Link
              to="/marks"
              className="btn nav-btn btn-outline-light text-white"
            >
              Marks Management
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/students" element={<StudentRegistration />} />
        <Route path="/marks" element={<MarkManagement />} />
      </Routes>
    </Router>
  );
}

export default Main;
