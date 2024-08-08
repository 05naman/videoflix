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
      className="flex items-center w-full max-w-2xl mx-auto bg-gray-100 rounded-full shadow-lg"
    >
      <input
        type="text"
        placeholder="Search"
        {...register("query", { required: true })}
        className="w-full py-2 px-4 rounded-full bg-gray-100 text-gray-800 outline-none placeholder-gray-500"
      />
      <button
        type="submit"
        className="flex items-center justify-center p-3 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <FaSearch className="text-lg" />
      </button>
    </form>
  );
}

export default Search;
