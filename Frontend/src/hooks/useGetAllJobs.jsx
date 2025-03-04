import axiosInstance from "@/utils/AxiosInstance";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";

const useGetAllJobs = () => {
  const dispatch = useDispatch();

  const fetchAllJobs = async () => {
    try {
      const response = await axiosInstance.get("/jobs/all");
      console.log(response);
      dispatch(setAllJobs(response.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);
  return null;
};

export default useGetAllJobs;
