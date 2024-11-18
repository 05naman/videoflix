import React from "react";
import logo from "../assets/logo.png";

function Logo({ className, inline = false, mobile = false }) {
  return (
    <div
      className={`font-bold text-xl flex items-center w-full ${className} text-[#FFFFFF]`}
    >
      <img
        src={logo}
        alt="logo"
        className="w-16 h-16 inline-block mr-2"
      />

      <div
        className={`flex ${inline ? "flex-row" : "flex-col"} ${
          mobile && "hidden md:block"
        }`}
      >
        <div className="font-sans font-semibold text-3xl">Videoflix</div>
      </div>
    </div>
  );
}

export default Logo;
