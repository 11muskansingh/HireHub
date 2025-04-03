import axiosInstance from "@/utils/AxiosInstance.jsx";
import { useEffect } from "react"; // Ensure useEffect is imported from React
import { useDispatch } from "react-redux";
import { setCompanies } from "@/redux/companySlice.js";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();

  const getAllCompany = async () => {
    try {
      const response = await axiosInstance.get(`/companies/getCompanies`);
      console.log("The current company response is", response);
      dispatch(setCompanies(response.data.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCompany();
  }, []);

  return null;
};

export default useGetAllCompanies;
