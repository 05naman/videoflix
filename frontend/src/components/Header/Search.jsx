import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";

function Search() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Search query:", data?.query); // Add console log to check the query
    navigate(`/search/${data?.query}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center w-full bg-gray-100 rounded-full shadow-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all"
    >
      <input
        type="text"
        placeholder="Search videos..."
        {...register("query", { required: true })}
        className="w-full py-2.5 px-4 rounded-l-full bg-transparent text-gray-800 outline-none placeholder-gray-500 text-sm sm:text-base"
      />
      <button
        type="submit"
        className="flex items-center justify-center p-2.5 pr-4 text-gray-500 hover:text-gray-700 transition-colors rounded-r-full hover:bg-gray-200"
      >
        <FaSearch className="text-lg" />
      </button>
    </form>
  );
}

export default Search;
