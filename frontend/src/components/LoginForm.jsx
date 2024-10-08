import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/auth.hook";
import { Input, Button } from "./index";

function LoginForm({ onLogin }) {
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

  const { mutateAsync: login, isPending, isError, error } = useLogin();

  const loginUser = async (data) => {
    try {
      const session = await login(data);
      if (session) {
        onLogin(session);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit(loginUser)} className="flex flex-col text-[#FFFFFF]">
      <Input className="text-black mb-2"
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
      <Input className="mb-4"
        label={"Password"}
        type="password"
        placeholder="Password"
        id={"password"}
        {...register("password", {
          required: true,
        })}
      />
      {errors.password && (
        <span className="text-red-500 text-sm">{errors.password.message}</span>
      )}
      <div className="flex justify-center">
        <Button width="w-32" height="h-11" className="bg-black hover:bg-teal-500 hover:text-white text-lg mt-3" type="submit">{isPending ? "Logging In" : "Login"}</Button>
      </div>
    </form>
  );
}

export default LoginForm;