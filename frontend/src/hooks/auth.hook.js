import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, logout, getCurrentUser, registerUser, changePassword } from "../api/auth.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data) => login(data),
    retry: 0,
  });
};
export const useLogout = () => {
  return useMutation({
    mutationFn: () => logout(),
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

import { useMutation } from '@tanstack/react-query'; // Adjust import based on your setup
import { registerUser } from './api'; // Import your API call function

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (user) => registerUser(user),
    onSuccess: (data) => {
      // Handle success (e.g., show a success message or redirect)
      console.log('User registered successfully:', data);
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error('Error registering user:', error);
    },
  });
};


export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => changePassword(data),
  });
};
