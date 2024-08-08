import React, { useState, useEffect } from 'react';
import Logo from '../Logo';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from "../../hooks/auth.hook";
import { setUser } from "../../store/authSlice";
import { Button } from "../index";
import { BiLike } from "react-icons/bi";
import { GoDeviceCameraVideo } from "react-icons/go";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { CiSettings } from "react-icons/ci";
import { IconContext } from "react-icons";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { setShowUploadVideo } from "../../store/uiSlice";
import Search from "./Search";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [sideBar, setSideBar] = useState(false);

  const handleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  const mobileSidebarItems = [
    { name: "Liked Videos", path: "/liked-videos", icon: <BiLike /> },
    { name: "My Channel", path: `/channel/${userData?.username}/videos`, icon: <GoDeviceCameraVideo /> },
    { name: "Support", path: "/support", icon: <RxQuestionMarkCircled /> },
    { name: "Settings", path: "/edit-profile/personal-info", icon: <CiSettings /> },
  ];

  useEffect(() => {
    setSideBar(false);
  }, [location.pathname]);

  const handleUploadVideo = () => {
    navigate("/my-studio");
    dispatch(setShowUploadVideo(true));
  };

  const { mutateAsync: logout } = useLogout();

  const handleLogout = async () => {
    const sessionStatus = await logout();
    if (sessionStatus) {
      dispatch(setUser(null));
      navigate('/login'); // Redirect to login after logout
    }
  };

  return (
    <header className="z-[9999] sticky inset-x-0 top-0 w-full text-white bg-[#0e0e0e] py-2">
      <nav className="mx-auto flex items-center justify-between max-w-7xl py-2 px-4">
        <Link to="/" className="flex items-center">
          <Logo className="shrink-0 w-[8rem]" />
        </Link>

        <div className="flex-grow flex justify-center">
          <Search />
        </div>

        <button
          onClick={handleSideBar}
          className="cursor-pointer group peer ml-4 flex w-6 shrink-0 flex-wrap gap-y-1.5 sm:hidden"
        >
          <span className="block h-[2px] w-full bg-white group-hover:bg-blue-400"></span>
          <span className="block h-[2px] w-2/3 bg-white group-hover:bg-blue-400"></span>
          <span className="block h-[2px] w-full bg-white group-hover:bg-blue-400"></span>
        </button>

        <div
          className={`fixed inset-y-0 right-0 flex w-full max-w-xs shrink-0 ${
            sideBar ? "translate-x-0" : "translate-x-full"
          } flex-col border-l border-white bg-[#0e0e0e] duration-200 sm:static sm:ml-4 sm:w-auto sm:translate-x-0 sm:border-none`}
        >
          <div className="relative flex w-full h-[4rem] items-center justify-end border-b border-white px-4 py-2 sm:hidden">
            <button
              onClick={handleSideBar}
              className="inline-block cursor-pointer"
            >
              <IoIosCloseCircleOutline className="w-9 h-9" />
            </button>
          </div>
          <IconContext.Provider value={{ className: "w-6 h-6" }}>
            <ul className="my-4 flex w-full flex-wrap gap-2 px-4 sm:hidden">
              {mobileSidebarItems.map((item, index) => (
                <li key={index} className="w-full">
                  <Link
                    to={item.path}
                    className="flex w-full items-center justify-start gap-x-4 border border-white px-4 py-1.5 text-left hover:bg-blue-400 hover:text-black focus:border-blue-500 focus:bg-blue-400 focus:text-black"
                  >
                    <span className="inline-block w-full max-w-[20px] group-hover:mr-4 lg:mr-4">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </IconContext.Provider>
          <div className="mb-8 mt-auto flex w-full flex-wrap gap-4 px-4 sm:mb-0 sm:mt-0 sm:px-0">
            <Button className="bg-green-800" onClick={handleUploadVideo}>Upload Video</Button>

            {authStatus && userData ? (
              <>
                <Button
                  className="bg-red-700 hover:bg-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <div className="mb-8 mt-auto px-4 sm:mb-0 sm:mt-0 sm:px-0">
                  <Link
                    to={`/channel/${userData?.username}/videos`}
                    className="flex w-full gap-4 text-left sm:items-center"
                  >
                    <img
                      src={userData.avatar?.url}
                      alt={userData.username}
                      className="object-cover h-16 w-16 shrink-0 rounded-full sm:h-12 sm:w-12"
                    />
                    <div className="w-full pt-2 sm:hidden">
                      <h6 className="font-semibold">{userData.fullName}</h6>
                      <p className="text-sm text-gray-300">
                        {userData.username}
                      </p>
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <Link to="/login">
                <button className="bg-blue-800 mr-1 rounded px-3 py-2 text-center text-white transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
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