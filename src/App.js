// src/config/approuter/approuter.js
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home"; // Make sure this path is correct
import Dashboard from "./dashboard/Dashboard"; // Create this component for the dashboard

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home Page */}
        <Route path="/dashboard/*" element={<Dashboard />} /> {/* Dashboard */}
      </Routes>
    </BrowserRouter>
  );
}
