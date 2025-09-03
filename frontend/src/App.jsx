import React, { useEffect, useState } from "react";
import { Header, SpinnerLoading } from "./components/index.js";
import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
import { useCurrentUser } from "./hooks/auth.hook.js";
import { setUser } from "./store/authSlice.js";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: userData, isFetching, error } = useCurrentUser();

  // Initialize authentication only once on app load
  useEffect(() => {
    if (!isFetching && !isInitialized) {
      if (userData) {
        dispatch(setUser(userData));
      } else {
        // No user data means not authenticated, ensure user is cleared
        dispatch(setUser(null));
      }
      setIsInitialized(true);
    }
  }, [userData, isFetching, dispatch, isInitialized]);

  // Handle error case
  useEffect(() => {
    if (error && !isInitialized) {
      console.log("Authentication error:", error);
      // On error, ensure user is cleared
      dispatch(setUser(null));
      setIsInitialized(true);
    }
  }, [error, isInitialized]);

  // Show loading only during initial authentication check
  if (!isInitialized && isFetching) {
    return <SpinnerLoading />;
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
