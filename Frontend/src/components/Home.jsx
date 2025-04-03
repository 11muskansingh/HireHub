import React, { useEffect } from "react";
import Navbar from "./Shared/Navbar.jsx";
import HeroSection from "./HeroSection.jsx";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs.jsx";
import Footer from "./Shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  useGetAllJobs();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (user?.role === "recruiter") navigate("/admin/companies");
  }, []);
  return (
    <>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </>
  );
};

export default Home;
