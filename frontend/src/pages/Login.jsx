import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo, LoginForm } from "../components/index.js";
import { useDispatch, useSelector } from "react-redux";
import { setUser, unSetUser } from "../store/authSlice";
import { FiX } from "react-icons/fi";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [showLoginPopup, setShowLoginPopup] = React.useState(true); // Show popup initially

  const onLogin = (session) => {
    if (session) {
      dispatch(setUser(session));
      navigate("/");
    } else {
      dispatch(unSetUser());
      // Optionally handle login failure or redirect
    }
  };

  const handleCloseLoginPopup = () => {
    console.log("Closing login popup and navigating to home."); // Debug log
    setShowLoginPopup(false);
    navigate("/"); // Navigate to home
  };

  // Optional: Redirect to home if login popup is closed
  React.useEffect(() => {
    if (!showLoginPopup) {
      navigate("/");
    }
  }, [showLoginPopup, navigate]);

  if (!showLoginPopup) {
    return null; // Hide the component when not needed
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#101518] flex justify-center items-center">
      <div className="w-full max-w-lg bg-gray-100 text-black rounded-xl p-10 border border-black/10 shadow-xl relative">
        <button
          onClick={handleCloseLoginPopup}
          className="absolute top-4 right-4 text-black p-2 rounded-full transition-colors"
          aria-label="Close"
        >
          <FiX size={20} />
        </button>

        <div className="w-full flex justify-center items-center">
          <Logo className="text-black text-center text-2xl font-semibold mr-5" inline={true} />
        </div>
        <div className="w-full flex flex-col items-center mb-6">
          <h1 className="text-2xl text-black font-bold mb-2">Login</h1>
          <span className="text-black">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-400">
              Sign Up
            </Link>
          </span>
        </div>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
}

export default Login;
