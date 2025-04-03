import { setAllAdminJobs } from "@/redux/jobSlice.js";
import axiosInstance from "@/utils/AxiosInstance.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
//ye hook h
const useGetAllAdminJobs = async () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        console.log("Chalu ho gya");
        const res = await axiosInstance.get("/jobs/allJobs");
        console.log("Admin Jobs", res);
        dispatch(setAllAdminJobs(res.data.data));
      } catch (error) {
        console.log("Error yaha hai...", error);
      }
    };
    fetchAllAdminJobs();
  }, []);
};

export default useGetAllAdminJobs;
