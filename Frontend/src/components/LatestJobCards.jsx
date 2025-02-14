import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const colors = [
  "#f0f4f8",
  "#e8f0fe",
  "#f3e5f5",
  "#e0f7fa",
  "#f1f8e9",
  "#fff3e0",
];

const LatestJobCards = ({ index }) => {
  return (
    <div
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100 rounded-md cursor-pointer"
      style={{ backgroundColor: colors[index % colors.length] }}
    >
      <div>
        <h1 className="font-medium text-lg">Company Name</h1>
        <p className="text-sm text-gray-500">India</p>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2">Title</h1>
        <p className="text-sm text-gray-600">Description</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className={"text-blue-700 font-bold"} variant="ghost">
          {" "}
          Positions
        </Badge>
        <Badge className={"text-[#F83002] font-bold"} variant="ghost">
          JobType
        </Badge>
        <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
          Salary LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
