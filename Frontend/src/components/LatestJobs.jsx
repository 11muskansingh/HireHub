import React from "react";
import LatestJobCards from "./LatestJobCards";

const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-[#6A38C2]">Latest & Top </span> Job Openings
      </h1>
      <div className="items-center justify-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        {randomJobs.length <= 0 ? (
          <span>No Job Available</span>
        ) : (
          randomJobs
            ?.slice(0, 6)
            .map((job, index) => <LatestJobCards key={index} index={index} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
