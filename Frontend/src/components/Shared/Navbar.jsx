import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "../ui/avatar";
import { auth } from "@/FireBase";
import { signOut } from "firebase/auth";
import { LogOut, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setLoading, setUser } from "@/redux/authslice.js";
import axiosInstance from "@/utils/AxiosInstance";
import { toast } from "@/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      dispatch(setLoading(true));
      await signOut(auth);
      dispatch(setUser(null));
      navigate("/");
      toast({
        title: "Success",
        description: "Logged out successfully",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    } finally {
      dispatch(setLoading(false));
      setIsMenuOpen(false); // Close the popover after logout
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">
            Hire<span className="text-[#0d7cab]">Hub</span>
          </Link>
        </div>

        {/* Popover for Smaller Screens */}
        <div className="sm:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="text-gray-700 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {user ? (
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={user?.profile?.profilePhoto || "/default-avatar.png"}
                      alt={user?.fullname || "User"}
                    />
                  </Avatar>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    ></path>
                  </svg>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64"
              onClick={() => setIsMenuOpen(false)} // Close popover on any click
            >
              <ul className="flex flex-col font-medium items-start gap-4">
                {user && user.role === "recruiter" ? (
                  <>
                    <li>
                      <Link to="/admin/companies">Companies</Link>
                    </li>
                    <li>
                      <Link to="/admin/jobs">Jobs</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/jobs">Jobs</Link>
                    </li>
                    <li>
                      <Link to="/browse">Browse</Link>
                    </li>
                  </>
                )}
              </ul>
              <div className="mt-4">
                {!user ? (
                  <div className="flex flex-col items-start gap-2">
                    <Link to="/login">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsMenuOpen(false)} // Close popover
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button
                        className="bg-[#0d7cab] hover:bg-[#074763] w-full"
                        onClick={() => setIsMenuOpen(false)} // Close popover
                      >
                        Signup
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col items-start gap-2">
                    {user && user.role === "student" && (
                      <div className="flex items-center gap-2">
                        <User2 />
                        <Link
                          to="/profile"
                          onClick={() => setIsMenuOpen(false)} // Close popover
                        >
                          View Profile
                        </Link>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <LogOut />
                      <Button
                        onClick={logoutHandler}
                        variant="link"
                        className="text-left"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Navigation Links for Larger Screens */}
        <div className="hidden sm:flex items-center gap-12">
          <ul className="flex flex-row font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li>
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li>
                  <Link to="/browse">Browse</Link>
                </li>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#0d7cab] hover:bg-[#074763]">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || "/default-avatar.png"}
                    alt={user?.fullname || "User"}
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-2 space-y-2">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user?.profile?.profilePhoto || "/default-avatar.png"}
                      alt={user?.fullname || "User"}
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col my-2 text-gray-600">
                  {user && user.role === "student" && (
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <User2 />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <LogOut />
                    <Button onClick={logoutHandler} variant="link">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
