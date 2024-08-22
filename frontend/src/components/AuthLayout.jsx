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
  GuestTweets
} from "./Guest.jsx";

const guestComponents = {
  MyChannel: GuestMyChannel,
  MyStudio: GuestMyStudio,
  Subscriptions: GuestSubscriptions,
  LikedVideos: GuestLikedVideos,
  History: GuestHistory,
  Settings: GuestSettings,
  Tweets: GuestTweets
};

const loginTo = {
  MyChannel: "Create your channel",
  MyStudio: "Create and share your content",
  Subscriptions: "Never miss a video",
  LikedVideos: "Save your favorite moments",
  History: "Keep track of what you watch",
  Settings: "Customize your experience",
  Tweets: "Share your thoughts",
};

function AuthLayout({ auth, children, pageName }) {
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [showLoginPopup, setShowLoginPopup] = React.useState(false);
  const navigate = useNavigate();

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  if (auth && authStatus) {
    return children;
  }

  if (auth && !authStatus) {
    if (showLoginPopup) {
      navigate("/login");
    }
    const GuestComponent = guestComponents[pageName];
    return GuestComponent ? (
      <div className="relative overflow-hidden w-full justify-center flex bg-black">
        <GuestComponent />
        <div className="absolute left-1/2 bottom-[30%] transform -translate-x-1/2">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 text-lg font-semibold"
            onClick={() => setShowLoginPopup(true)}
          >
            Sign In
          </button>
        </div>
      </div>
    ) : (
      <div>Guest component not found</div>
    );
  }

  return children;
}

export default AuthLayout;
