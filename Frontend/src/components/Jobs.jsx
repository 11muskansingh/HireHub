import React, { useEffect, useState } from "react";
import FilterCard from "./FilterCard";
import Job from "./Job.jsx";
import Navbar from "./Shared/Navbar.jsx";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  const colors = [
    "#f0f4f8",
    "#e8f0fe",
    "#f3e5f5",
    "#e0f7fa",
    "#f1f8e9",
    "#fff3e0",
  ];
  //const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
      setFilterJobs(filteredJobs);
    } else setFilterJobs(allJobs);
  }, [allJobs, searchedQuery]);
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-20%">
            <FilterCard />
          </div>
          {filterJobs.length <= 0 ? (
            <span>Job not found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filterJobs.map((job, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job?._id}
                  >
                    <div
                      key={index}
                      // className=" cursor-pointer transform transition-transform duration-300 hover:scale-105"
                      // style={{ backgroundColor: colors[index % colors.length] }}
                    >
                      <Job
                        job={job}
                        backgroundColor={colors[index % colors.length]}
                      />
                    </div>
                    {/* //{" "} */}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Jobs;
