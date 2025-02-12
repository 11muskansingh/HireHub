import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import React from "react";

const Navbar = () => {
  const user = false;
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 ">
        <div className="text-2xl font-bold">
          Hire<span className="text-rose-700">Hub</span>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            <li>Home</li>
            <li>Jobs</li>
            <li>Browse</li>
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              <Button variant="outline">Login</Button>
              <Button className="bg-red-600 hover:bg-red-800">Signup</Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage src="https://www.shutterstock.com/image-vector/user-profile-260nw-717523903.jpg" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <h1>Yet to create</h1>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
