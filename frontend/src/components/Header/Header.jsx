import React, { useState, useEffect } from "react";
import Logo from "../Logo";
import Button from "../Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "../../hooks/auth.hook";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/authSlice";

import { BiLike } from "react-icons/bi";
import { GoDeviceCameraVideo } from "react-icons/go";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { CiSettings } from "react-icons/ci";
import { IconContext } from "react-icons";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { setShowUploadVideo } from "../../store/uiSlice";
import Search from "./Search";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.authStatus);
  const userData = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const { mutateAsync: logout } = useLogout();

  const [sideBar, setSideBar] = useState(false);

  const handleLogout = async () => {
    const sessionStatus = await logout();
    if (sessionStatus) {
      dispatch(setUser(null));
    }
  };

  const handleUploadVideo = () => {
    navigate("/my-studio");
    dispatch(setShowUploadVideo(true));
  };

  const mobileSidebarItems = [
    {
      name: "Liked Videos",
      path: "/liked-videos",
      icon: <BiLike />,
    },
    {
      name: "My Channel",
      path: `/channel/${userData?.username}/videos`,
      icon: <GoDeviceCameraVideo />,
    },
    {
      name: "Support",
      path: "/support",
      icon: <RxQuestionMarkCircled />,
    },
    {
      name: "Settings",
      path: "/edit-profile/personal-info",
      icon: <CiSettings />,
    },
  ];

  const handleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  useEffect(() => {
    setSideBar(false);
  }, [location.pathname]);

  return (
    <header className="z-[9999] sticky inset-x-0 top-0 w-full text-white bg-[#0e0e0e] border-b border-gray-800">
      <nav className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo Section - Left */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center">
            <Logo className="w-24 sm:w-32 md:w-36" mobile={true} />
          </Link>
        </div>

        {/* Search Bar Section - Center */}
        <div className="flex-1 flex justify-center px-4 max-w-2xl mx-auto">
          <div className="w-full">
            <Search />
          </div>
        </div>

        {/* Desktop Actions - Right */}
        <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors" 
            onClick={handleUploadVideo}
          >
            Upload Video
          </Button>

          {authStatus && userData ? (
            <div className="flex items-center space-x-3">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={handleLogout}
              >
                Logout
              </Button>
              <Link
                to={`/channel/${userData?.username}/videos`}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={userData.avatar}
                  alt={userData.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium hidden lg:block">{userData.fullName}</span>
              </Link>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Log in
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={handleSideBar}
          className="md:hidden cursor-pointer group flex w-6 shrink-0 flex-wrap gap-y-1.5 ml-2"
        >
          <span className="block h-[2px] w-full bg-white group-hover:bg-blue-400 transition-colors"></span>
          <span className="block h-[2px] w-2/3 bg-white group-hover:bg-blue-400 transition-colors"></span>
          <span className="block h-[2px] w-full bg-white group-hover:bg-blue-400 transition-colors"></span>
        </button>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 flex w-full max-w-xs shrink-0 ${
            sideBar ? "translate-x-0" : "translate-x-full"
          } flex-col border-l border-gray-700 bg-[#0e0e0e] duration-200 md:hidden z-50`}
        >
          <div className="relative flex w-full h-16 items-center justify-end border-b border-gray-700 px-4">
            <button
              onClick={handleSideBar}
              className="inline-block cursor-pointer hover:opacity-70 transition-opacity"
            >
              <IoIosCloseCircleOutline className="w-8 h-8" />
            </button>
          </div>
          
          <IconContext.Provider value={{ className: "w-6 h-6" }}>
            <ul className="my-4 flex w-full flex-wrap gap-2 px-4">
              {mobileSidebarItems.map((item, index) => (
                <li key={index} className="w-full">
                  <Link
                    to={item.path}
                    className="flex w-full items-center justify-start gap-x-4 border border-gray-600 px-4 py-3 text-left hover:bg-blue-600 hover:text-white focus:border-blue-500 focus:bg-blue-600 focus:text-white transition-colors rounded-lg"
                  >
                    <span className="inline-block w-6">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </IconContext.Provider>
          
          <div className="mt-auto mb-4 flex w-full flex-wrap gap-3 px-4">
            <Button 
              className="bg-green-600 hover:bg-green-700 w-full" 
              onClick={handleUploadVideo}
            >
              Upload Video
            </Button>

            {authStatus && userData ? (
              <>
                <Button
                  className="bg-red-600 hover:bg-red-700 w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <div className="w-full px-4 py-3 border border-gray-600 rounded-lg">
                  <Link
                    to={`/channel/${userData?.username}/videos`}
                    className="flex w-full gap-4 text-left items-center"
                  >
                    <img
                      src={userData.avatar}
                      alt={userData.username}
                      className="object-cover h-12 w-12 shrink-0 rounded-full"
                    />
                    <div className="w-full">
                      <h6 className="font-semibold text-white">{userData.fullName}</h6>
                      <p className="text-sm text-gray-300">
                        {userData.username}
                      </p>
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <Link to="/login" className="w-full">
                <button className="bg-blue-600 hover:bg-blue-700 w-full rounded px-4 py-2 text-center text-white transition-colors">
                  Log in
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
  
}

export default Header;