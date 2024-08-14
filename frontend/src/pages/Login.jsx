import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/index.js";
import { LoginForm } from "../components/index.js";
import { useDispatch } from "react-redux";
import { setUser,unSetUser } from "../store/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogin = (session) => {
    if (session) {
      dispatch(setUser(session));
      navigate("/");
    } else {
      dispatch(unSetUser());
      // Optionally handle login failure or redirect
    }
  };
  return (
    <div className="h-screen overflow-y-auto bg-[#101518] text-black flex justify-center items-center">
       <div className={`  w-full max-w-lg bg-gray-100 text-black rounded-xl p-10 border border-black/10 shadow-xl`}>
      <div className="mx-auto my-8 flex w-full max-w-sm flex-col px-4">
        <div className="w-full flex justify-center items-center">
          <Logo
            className={" w-full text-black text-center text-2xl font-semibold "}
            inline={true}
          />
        </div>

        <div className="w-full flex flex-col items-center justify-center mb-6">
          <h1 className="text-2xl text-black text-extrabold font-semibold">Login</h1>
          <span className="text-black ">
            Don't have an account? 
            <Link to="/signup" className="text-blue-500 inline">
            ‎ SignUp
            </Link>
          </span>
        </div>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
    </div>
  );
}

export default Login;