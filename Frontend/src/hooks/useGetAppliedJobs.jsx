import { setAllAppliedJobs } from "@/redux/jobSlice.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "@/utils/AxiosInstance,jsx";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axiosInstance.get("/applications/applied");
        console.log("All applied jobs", res);
        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAppliedJobs();
  }, []);
};
export default useGetAppliedJobs;
