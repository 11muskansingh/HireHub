import React from "react";
import LatestJobCards from "./LatestJobCards.jsx";
import { useSelector } from "react-redux";

//const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);
  return (
    <div className="max-w-7xl mx-8 my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-[#0d7cab]">Latest & Top </span> Job Openings
      </h1>
      <div className="items-center justify-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        {allJobs <= 0 ? (
          <span>No Job Available</span>
        ) : (
          allJobs
            ?.slice(0, 6)
            .map((job, index) => (
              <LatestJobCards key={job._id} job={job} index={index} />
            ))
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
