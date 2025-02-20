import React from "react";
import Navbar from "../Shared/Navbar";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { auth } from "../../FireBase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axiosInstance from "../../utils/axiosInstance";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = React.useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    profilePhoto: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePhoto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if email is already in use
      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        formData.email
      );

      if (signInMethods.length > 0) {
        toast({
          title: "Error",
          description:
            "Email already in use. Please log in or use a different email.",
          status: "error",
        });
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.fullname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      if (formData.profilePhoto) {
        formDataToSend.append("profilePhoto", formData.profilePhoto);
      }

      // for (let [key, value] of formDataToSend.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      await axiosInstance.post("/users/register", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Success",
        description: "User Registered Successfully",
        status: "success",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
      console.error(error.message);
    }
  };

  const handleGoogleSignIn = async (role) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log(user);
      const token = await user.getIdToken();

      const formDataToSend = new FormData();
      formDataToSend.append("fullname", user.displayName);
      formDataToSend.append("email", user.email);
      formDataToSend.append("phoneNumber", "");
      formDataToSend.append("role", role);
      formDataToSend.append("googleSignUp", true);
      if (user.photoURL) {
        console.log(user.photoURL);
        formDataToSend.append("profilePhotoUrl", user.photoURL);
      }

      await axiosInstance.post("/users/register", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Success",
        description: "User Registered Successfully",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
      console.error(error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10 shadow-md"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="my-2">
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
            />
          </div>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="my-2">
            <Label>Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={formData.role === "recruiter"}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Label>Profile</Label>
              <Input
                accept="image/*"
                type="file"
                name="profilePhoto"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
          </div>
          <Button type="submit" className="w-full my-4">
            Signup
          </Button>
          <div className="flex flex-col items-center justify-center">
            <Button
              type="button"
              onClick={() => handleGoogleSignIn("student")}
              className="w-full my-4 bg-white text-black flex items-center justify-center"
            >
              <FcGoogle className="mr-2" /> Sign Up with Google (Student)
            </Button>
            <Button
              type="button"
              onClick={() => handleGoogleSignIn("recruiter")}
              className="w-full my-4 bg-white text-black flex items-center justify-center"
            >
              <FcGoogle className="mr-2" /> Sign Up with Google (Recruiter)
            </Button>
          </div>
          <span className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-rose-700">
              Login
            </Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default Signup;
