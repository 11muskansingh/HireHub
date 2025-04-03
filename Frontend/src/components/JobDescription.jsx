import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/utils/AxiosInstance";
import { useToast } from "@/hooks/use-toast";
import { setSingleJob } from "@/redux/jobSlice";
import Navbar from "./Shared/Navbar";

const JobDescription = () => {
  const params = useParams();
  const id = params.id;
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { singleJob } = useSelector((store) => store.job);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const getCurrJob = async () => {
    try {
      const response = await axiosInstance.get(`/jobs/${id}`);
      //onsole.log(response);
      dispatch(setSingleJob(response.data.data));
      setIsApplied(
        response.data.data.job?.applications?.some(
          (application) => application.applicant === user?._id
        )
      ); // Ensure the state is in sync with fetched data
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  useEffect(() => {
    getCurrJob();
  }, [id, dispatch, user?._id]);

  useEffect(() => {
    setIsApplied(
      singleJob?.applications?.some((app) => app.applicant === user?._id)
    );
  }, [singleJob]);

  const applyJobHandler = async () => {
    try {
      const response = await axiosInstance.post(`/applications/apply/${id}`);
      console.log(response);
      const updatedSingleJob = {
        ...singleJob,
        applications: singleJob.applications
          ? [...singleJob.applications, { applicant: user?._id }]
          : [{ applicant: user?._id }],
      };
      dispatch(setSingleJob(updatedSingleJob));
      setIsApplied(true);

      toast({
        title: "Success",
        description: "Applied to job successfully",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          {singleJob?.company?.logo && (
            <img
              src={singleJob.company.logo}
              alt={`${singleJob.company.name} logo`}
              className="h-16 w-16 object-cover"
            />
          )}
          <h1 className="font-bold text-2xl text-center sm:text-left">
            {singleJob?.company?.name}
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:justify-between mt-4 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="font-bold text-xl">{singleJob?.title}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-4">
              <Badge className={"text-blue-700 font-bold"} variant="ghost">
                {singleJob?.postion} Positions
              </Badge>
              <Badge className={"text-[#F83002] font-bold"} variant="ghost">
                {singleJob?.jobType}
              </Badge>
              <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
                {singleJob?.salary} LPA
              </Badge>
            </div>
          </div>
          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg ${
              isApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>
        <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
          Job Description
        </h1>
        <div className="my-4">
          <h1 className="font-bold my-1">
            Role:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.title}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Location:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.location}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Description:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.description}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Experience:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.experienceLevel} yrs
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Salary:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.salary} LPA
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Total Applicants:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.applications?.length}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Posted Date:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.createdAt?.split("T")[0]}
            </span>
          </h1>
          {singleJob?.requirements && Array.isArray(singleJob.requirements) && (
            <div className="my-4">
              <h1 className="font-bold my-1">Requirements:</h1>
              <ul className="list-disc pl-8 text-gray-800">
                {singleJob.requirements[0]
                  .split(",") // Split the single string into an array of points
                  .map((requirement, index) => (
                    <li key={index}>{requirement.trim()}</li> // Trim extra spaces and render each point
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobDescription;
