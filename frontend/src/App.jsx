import React, { useEffect, useState } from "react";
import { Header, SpinnerLoading } from "./components/index.js";
import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
import { useCurrentUser } from "./hooks/auth.hook.js";
import { setUser } from "./store/authSlice.js";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { data: userData, isFetching, error } = useCurrentUser();
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!isFetching) {
      if (userData && !user) {
        dispatch(setUser(userData));
      }
      setIsLoading(false);
    }
  }, [userData, isFetching, dispatch, user]);

  if (isLoading || isFetching) {
    return <SpinnerLoading />;
  }

  if (error) {
    console.log(error);
    
    return <div className="text-red-500">Error loading user data. Please try again later.</div>;
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#0e0e0e] text-white">
      <Header />
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
