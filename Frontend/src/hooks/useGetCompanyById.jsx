import axiosInstance from "@/utils/AxiosInstance.jsx";
import { useEffect } from "react"; // Ensure useEffect is imported from React
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice.js";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  const getCompany = async () => {
    try {
      const response = await axiosInstance.get(`/companies/c/${companyId}`);
      console.log("The current company response is", response);
      dispatch(setSingleCompany(response.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompany();
  }, [companyId, dispatch]);

  return null;
};

export default useGetCompanyById;
