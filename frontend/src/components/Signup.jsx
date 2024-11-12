import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useLogin, useRegisterUser } from "../hooks/auth.hook.js";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice.js";
import { Logo, Input, Button } from "./index.js";
import { FiX } from "react-icons/fi";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(true);

  const schema = z.object({
    email: z.string().email(),
    username: z
      .string()
      .min(4)
      .refine((value) => !value.includes(" "), {
        message: "Username must not contain spaces",
      })
      .refine((value) => value === value.toLowerCase(), {
        message: "Username must be all lowercase",
      }),
    fullName: z.string().min(4),
    password: z.string().min(6),
    avatar: z.instanceof(FileList).refine((files) => files.length === 1, {
      message: "Avatar is required",
    }),
    coverImage: z.instanceof(FileList).refine((files) => files.length === 1, {
      message: "Cover Image is required",
    }),
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutateAsync: registerUser } = useRegisterUser();
  const { mutateAsync: loginUser } = useLogin();

  const createAccount = async (data) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);
    formData.append("coverImage", data.coverImage[0]);

    try {
      const registeredUser = await registerUser(formData);
      if (registeredUser) {
        // console.log("Registration successful:", registeredUser);
        const loggedInUser = await loginUser({
          usernameOrEmail: data.email,
          password: data.password,
        });
        if (loggedInUser) {
          dispatch(setUser(loggedInUser));
          navigate("/");
        }
      }
    } catch (error) {
      alert("Signup failed. Please try again.");
    }
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
    navigate("/"); // Navigate to home
  };

  if (!showLoginPopup) return null; // Prevent rendering if popup is closed

  return (
    <div className="h-screen overflow-y-auto bg-[#0e0e0e] text-white flex justify-center items-center">
      <div className="relative w-full max-w-3xl bg-gray-100 text-black rounded-xl p-12 border border-black/10 shadow-xl">
        <button
          onClick={handleCloseLoginPopup}
          className="absolute top-4 right-4 bg-gray-100 text-black p-2 rounded-full transition-colors"
          aria-label="Close"
        >
          <FiX size={22} />
        </button>

        <div className="w-full flex justify-center items-center">
          <Logo className="w-full text-center text-3xl font-semibold text-black mr-5" inline={true} />
        </div>

        <div className="w-full flex flex-col items-center justify-center mb-6">
          <h1 className="text-2xl font-bold mb-2 ml-5">Signup</h1>
          <span>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 inline">
              Login
            </Link>
          </span>
        </div>

        <form onSubmit={handleSubmit(createAccount)} className="flex flex-col space-y-6">
          {/* Row 1 */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                label={"Full Name"}
                type="text"
                placeholder="Enter your full name"
                id={"fullName"}
                {...register("fullName")}
                className="text-lg"
              />
              {errors.fullName && (
                <span className="text-red-500 text-sm">{errors.fullName.message}</span>
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input
                label={"Username"}
                type="text"
                placeholder="username"
                id={"username"}
                {...register("username")}
                className="text-lg"
              />
              {errors.username && (
                <span className="text-red-500 text-sm">{errors.username.message}</span>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                label={"Email"}
                type="email"
                placeholder="you@example.com"
                id={"email"}
                {...register("email")}
                className="text-lg"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input
                label={"Password"}
                type="password"
                placeholder="*******"
                id={"password"}
                {...register("password")}
                className="text-lg mb-4"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px]">
              <div className="mb-4">
                <label className="block text-lg font-medium text-teal-500">
                  Profile Picture
                </label>
                <input
                  type="file"
                  {...register("avatar")}
                  className="text-black mt-2"
                />
                {errors.avatar && (
                  <span className="text-red-500 text-sm">{errors.avatar.message}</span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="mb-4">
                <label className="block text-lg font-medium text-teal-500">
                  Cover Image
                </label>
                <input
                  type="file"
                  {...register("coverImage")}
                  className="text-black mt-2"
                />
                {errors.coverImage && (
                  <span className="text-red-500 text-sm">{errors.coverImage.message}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              className="hover:bg-teal-500 hover:text-white bg-black text-lg mt-5 w-44"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Signup"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;