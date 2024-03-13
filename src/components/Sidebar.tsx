import React from "react";
import logo from "../assets/img/logo.png";
import { ChevronFirst, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
type Props = {};

export default function Sidebar({ children }) {
  const navigation = useNavigate();

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img src={logo} alt="logo" className="w-32" />
          <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
            <ChevronFirst />
          </button>
        </div>
        <ul className="flex-1 px-3">{children}</ul>
        <ul className="p-3">
          <li
            onClick={() => {
              localStorage.clear();
              navigation("/login");
            }}
          >
            <div
              className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-blue-50 text-gray-600`}
            >
              <LogOut />
              <span className="w-52 ml-3">Keluar</span>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, path }) {
  return (
    <li>
      <Link
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
          active
            ? "bg-gradient-to-tr from-blue-200 to-blue-100 text-blue-800"
            : "hover:bg-blue-50 text-gray-600"
        }`}
        to={path}
      >
        {icon}
        <span className="w-52 ml-3">{text}</span>
      </Link>
    </li>
  );
}
