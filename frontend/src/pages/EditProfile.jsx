import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Link, Outlet } from "react-router-dom";
import defaultCoverImage from "../assets/defaultCoverImage.jpg";
import defaultAvatar from "../assets/defaultAvatar.png";
import { Avatar, CoverImage } from "../components/index.js";

function EditProfile() {
  const channelInfo = useSelector((state) => state.auth.user);

  const editProfileItems = [
    {
      name: "Personal Info",
      path: "personal-info",
    },
    {
      name: "Channel Info",
      path: "channel-info",
    },
    {
      name: "Change Password",
      path: "change-password",
    },
  ];

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <div className="absolute inset-0 overflow-hidden">
          <CoverImage
            coverImage={channelInfo?.coverImage || defaultCoverImage}
            alt="Cover Image"
          />
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-4 pb-4 pt-6">
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 rounded-full border-2">
            <Avatar
              avatar={channelInfo?.avatar || defaultAvatar}
              alt="Avatar"
            />
          </span>
          <div className="mr-auto inline-block">
            <h1 className="font-bold text-xl">{channelInfo?.fullName}</h1>
            <p className="text-sm text-gray-400">@{channelInfo?.username}</p>
          </div>
          <div className="inline-block">
            <div className="inline-flex min-w-[145px] justify-end">
              <Link
                to={`/channel/${channelInfo?.username}`}
                className="px-4 py-1.5 text-sm text-white bg-blue-800 rounded-md"
              >
                View Channel
              </Link>
            </div>
          </div>
        </div>
        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#0e0e0e] py-2 sm:top-[82px]">
          {editProfileItems.map((item, index) => (
            <li key={index} className="w-full">
              <NavLink  
                to={`/edit-profile/${item.path}`}
                className={({ isActive }) =>
                  isActive
                    ? "w-full border-b-2 rounded bg-white px-3 py-1.5 text-black"
                    : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400"
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <Outlet />
      </div>
    </section>
  );
}

export default EditProfile;
