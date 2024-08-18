import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice.js";
import { Input, Button, Logo } from "./index.js";
import { useLogin } from "../hooks/auth.hook";

const LoginPopup = ({ onClose, loginTo }) => {
  const dispatch = useDispatch();
  const { mutateAsync: login, isPending, isError, error } = useLogin();

  const schema = z.object({
    usernameOrEmail: z
      .string()
      .min(3, "Username or email must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const loginUser = async (data) => {
    try {
      const session = await login(data);
      if (session) {
        dispatch(setUser(session));
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#003554] bg-opacity-75 z-50">
      <div className="bg-[#003554] border border-blue-700 rounded-lg p-8 text-white w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#003554] text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <FiX size={20} />
        </button>

        <div className="flex flex-col gap-4 items-center mb-6">
          <Logo className="text-3xl font-bold text-blue-500" />
          <h2 className="text-xl font-semibold">
            Login to {loginTo || "Continue"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(loginUser)} className="flex flex-col text-[#FFFFFF]">
          <Input
            className="text-black"
            label={"Username/Email"}
            type="text"
            placeholder="Username"
            id={"username"}
            {...register("usernameOrEmail", {
              required: true,
            })}
          />
          {errors.usernameOrEmail && (
            <span className="text-red-500 text-sm">
              {errors.usernameOrEmail.message}
            </span>
          )}
          <Input
            label={"Password"}
            type="password"
            placeholder="Password"
            id={"password"}
            {...register("password", {
              required: true,
            })}
            className="mb-4"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
          <div className="flex justify-center">
            <Button
              width="w-32"
              className="bg-black hover:bg-teal-500 hover:text-white"
              type="submit"
            >
              {isPending ? "Logging In" : "Login"}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:text-blue-300">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
