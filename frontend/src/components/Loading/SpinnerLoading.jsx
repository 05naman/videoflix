import React from "react";
import Logo from "../Logo";

function SpinnerLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 z-[9999]">
      <div className="flex items-center gap-8">
        {/* Logo with subtle animation */}
        <div className="animate-pulse">
          <Logo className="w-32 h-auto" />
        </div>
        
        {/* Animated dots on the right side */}
        <div className="flex gap-2 mt-5">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0s] [animation-duration:1.4s]"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1.4s]"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1.4s]"></div>
        </div>
      </div>
    </div>
  );
}

export default SpinnerLoading;