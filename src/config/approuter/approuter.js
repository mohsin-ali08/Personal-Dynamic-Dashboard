import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../../pages/home";
import Dashboard from "../../dashboard/Dashboard"; 

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
