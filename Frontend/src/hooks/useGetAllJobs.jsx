import axiosInstance from "@/utils/AxiosInstance.jsx";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs, setSearchedQuery } from "@/redux/jobSlice.js";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);
  const fetchAllJobs = async () => {
    try {
      const endpoint = searchedQuery
        ? `/jobs/all?keyword=${searchedQuery}`
        : `/jobs/all`;
      const response = await axiosInstance.get(endpoint);
      console.log(response);
      dispatch(setAllJobs(response.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, [searchedQuery]);
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);
  return null;
};

export default useGetAllJobs;
