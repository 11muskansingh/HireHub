import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import Navbar from "./Shared/Navbar";

const FilterCard = () => {
  const filterData = [
    {
      filterType: "Location",
      array: [
        "Delhi",
        "Bangalore",
        "Hyderabad",
        "Pune",
        "Mumbai",
        "Gurgaon",
        "Chennai",
      ],
    },
    {
      filterType: "Industry",
      array: [
        "Frontend Developer",
        "Backend Developer",
        "FullStack Developer",
        "Data Scientist",
        "Graphic Designer",
      ],
    },
    {
      filterType: "Salary",
      array: ["0-40k", "42-1lakh", "1lakh to 10lakh", "Greater than 10lakh"],
    },
  ];

  const [selectedValue, setSelectedValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
    setIsSidebarOpen(false); // Close the sidebar when a filter is applied
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  return (
    <>
      {/* Sidebar Toggle Button for Small Screens */}
      <div className="sm:hidden fixed top-14 left-4 z-50">
        <Button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-[#0d7cab] text-white px-4 py-2 rounded-md"
        >
          Open Filters
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 bg-white shadow-lg z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 sm:hidden`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">Filter Jobs</h1>
            <Button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <hr className="mt-3" />
          <RadioGroup value={selectedValue} onValueChange={changeHandler}>
            {filterData.map((data, index) => (
              <div key={index} className="mt-4">
                <h1 className="font-bold text-lg">{data.filterType}</h1>
                {data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`;
                  return (
                    <div
                      key={itemId}
                      className="flex items-center space-x-2 my-2"
                    >
                      <RadioGroupItem value={item} id={itemId} />
                      <Label htmlFor={itemId}>{item}</Label>
                    </div>
                  );
                })}
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* FilterCard for Larger Screens */}
      <div className="hidden sm:block w-full bg-white p-3 rounded-md shadow-md">
        <h1 className="font-bold text-lg">Filter Jobs</h1>
        <hr className="mt-3" />
        <RadioGroup value={selectedValue} onValueChange={changeHandler}>
          {filterData.map((data, index) => (
            <div key={index} className="mt-4">
              <h1 className="font-bold text-lg">{data.filterType}</h1>
              {data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`;
                return (
                  <div
                    key={itemId}
                    className="flex items-center space-x-2 my-2"
                  >
                    <RadioGroupItem value={item} id={itemId} />
                    <Label htmlFor={itemId}>{item}</Label>
                  </div>
                );
              })}
            </div>
          ))}
        </RadioGroup>
      </div>
    </>
  );
};

export default FilterCard;
