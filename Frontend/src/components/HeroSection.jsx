import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice.js";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="text-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 my-10">
        {/* Tagline */}
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#0d7cab] font-medium text-sm sm:text-base">
          No. 1 Job Hunt Website
        </span>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          Search, Apply & <br /> Get Your{" "}
          <span className="text-[#0d7cab]">Dream Jobs</span>
        </h1>

        {/* Subheading */}
        <p className="font-medium text-sm sm:text-base lg:text-lg">
          Find the perfect job that matches your skills and ambition. Take the
          next step in your career today!
        </p>

        {/* Responsive Search Bar */}
        <div className="flex flex-row w-full sm:w-[90%] lg:w-[55%] shadow-lg border border-gray-200 px-4 py-1.5 rounded-full items-center mx-auto">
          <input
            type="text"
            placeholder="Find your dream jobs"
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none flex-grow text-sm sm:text-base px-3 py-2 rounded-l-full"
          />
          <Button
            onClick={searchJobHandler}
            className="bg-[#0d7cab] px-6 py-2 flex items-center justify-center text-white hover:bg-[#095c7a] transition-all duration-300 rounded-r-full h-auto"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
