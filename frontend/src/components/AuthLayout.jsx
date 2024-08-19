import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import {
  GuestMyChannel,
  GuestMyStudio,
  GuestSubscriptions,
  GuestLikedVideos,
  GuestHistory,
  GuestSettings,
} from "./Guest.jsx";

const guestComponents = {
  MyChannel: GuestMyChannel,
  MyStudio: GuestMyStudio,
  Subscriptions: GuestSubscriptions,
  LikedVideos: GuestLikedVideos,
  History: GuestHistory,
  Settings: GuestSettings,
};

function AuthLayout({ auth, children, pageName }) {
  const authStatus = useSelector((state) => state.auth.authStatus);
  const navigate = useNavigate();

  if (auth && authStatus) {
    return children;
  }

  if (auth && !authStatus) {
    // Redirect to the login page if not authenticated
    navigate("/login");

    // Render nothing or a placeholder until navigation occurs
    return null;
  }

  const GuestComponent = guestComponents[pageName];
  return GuestComponent ? (
    <div className="relative overflow-hidden w-full justify-center flex bg-black">
      <GuestComponent />
      <div className="absolute left-1/2 bottom-[30%] transform -translate-x-1/2">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 text-lg font-semibold"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </div>
    </div>
  ) : (
    <div>Guest component not found</div>
  );
}

export default AuthLayout;
