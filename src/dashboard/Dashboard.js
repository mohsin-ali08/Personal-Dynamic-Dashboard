import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";
import {
  UserOutlined,
  ReadOutlined,
  PictureOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Users from "./users";
import Posts from "./Posts";
import Albums from "./Albums";
import Photos from "./Photos";
import Todos from "./Todos";
import Comments from "./Comments";
import adminPicture from "../assets/Admin.jpeg";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-400 ">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-20 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 w-full md:w-1/4 border-r-2 border-gray-300 text-black min-h-screen overflow-y-auto flex items-center px-5 backdrop-blur-md bg-black bg-opacity-30`}
      >
        {/* Centered and larger navigation links */}
        <nav className="relative z-10 w-full flex flex-col md:space-y-3 space-y-7 bg-white shadow-lg text-black border-[1.4px] rounded-lg md:p-4 py-10 px-5">
          {/* Admin Picture */}
          <div className="flex justify-center">
            <img
              src={adminPicture}
              alt="Admin"
              className="rounded-full w-24 h-24 object-cover border-[3px] border-green-500 shadow"
            />
          </div>
          <h2 className="text-xl font-bold mb-4 text-center border-b pb-2">
            Admin!
          </h2>
          {[
            { name: "Users", icon: <UserOutlined />, path: "users" },
            { name: "Posts", icon: <ReadOutlined />, path: "posts" },
            { name: "Albums", icon: <PictureOutlined />, path: "albums" },
            { name: "Photos", icon: <FileImageOutlined />, path: "photos" },
            { name: "Todos", icon: <CheckCircleOutlined />, path: "todos" },
            { name: "Comments", icon: <CommentOutlined />, path: "comments" },
          ].map((item) => (
            <Link
              key={item.name}
              className="flex items-center font-bold text-md px-4 py-3 w-full bg-gray-100 rounded-lg border-[1.4px] transition duration-300 hover:scale-105  hover:border-white hover:bg-green-600 hover:text-white"
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Hamburger Menu Button */}
      <div className="absolute top-4 left-4 md:hidden z-30">
        <HamburgerMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-5 overflow-auto">
        <Routes>
          <Route path="users" element={<Users />} />
          <Route path="posts" element={<Posts />} />
          <Route path="albums" element={<Albums />} />
          <Route path="photos" element={<Photos />} />
          <Route path="todos" element={<Todos />} />
          <Route path="comments" element={<Comments />} /> 
        </Routes>
      </div>
    </div>
  );
}
