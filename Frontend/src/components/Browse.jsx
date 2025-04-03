import React from "react";
import Navbar from "./Shared/Navbar.jsx";
import Job from "./Job.jsx";
import { useSelector } from "react-redux";
const colors = [
  "#f0f4f8",
  "#e8f0fe",
  "#f3e5f5",
  "#e0f7fa",
  "#f1f8e9",
  "#fff3e0",
];
const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];
const Browse = () => {
  const { allJobs } = useSelector((store) => store.job);
  return (
    <>
      <Navbar />
      <div className="flex gap-5 flex-col max-w-7xl mx-auto mt-5">
        <div className="text-lg font-semibold">
          Search Result({allJobs.length})
        </div>
        <div className="h-[88vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {allJobs.map((job, index) => (
            <div
              key={index}
              className=" cursor-pointer transform transition-transform duration-300 hover:scale-105"
            >
              <Job
                key={job._id}
                job={job}
                backgroundColor={colors[index % colors.length]}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Browse;
