import React, { useState } from "react";
import Navbar from "../Shared/Navbar";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../FireBase";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser, setToken } from "@/redux/authslice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector((store) => store.auth);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      const response = await axiosInstance.post(
        "/users/login",
        {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(token);
      console.log(response);
      dispatch(setUser(response.data.data));
      toast({
        title: "Success",
        description: "Logged in successfully",
        status: "success",
      });
      dispatch(setToken(token));
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
      console.log(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = async (role) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      console.log("Logged in user", user);

      const response = await axiosInstance.post(
        "/users/login",
        {
          email: user.email,
          googleSignIn: true,
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(token);
      dispatch(setToken(token));
      console.log(response);
      dispatch(setUser(response.data.data));
      toast({
        title: "Success",
        description: "Logged in successfully",
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

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-12 shadow-md"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>
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
          </div>
          {loading ? (
            <Button className="w-full my-4">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Login
            </Button>
          )}

          <Button
            type="button"
            onClick={() => {
              handleGoogleLogin("student");
            }}
            className="w-full my-4 bg-white text-black flex items-center justify-center"
          >
            <FcGoogle className="mr-2" /> Login with Google (Student)
          </Button>

          <Button
            type="button"
            onClick={() => {
              handleGoogleLogin("recruiter");
            }}
            className="w-full my-4 bg-white text-black flex items-center justify-center"
          >
            <FcGoogle className="mr-2" /> Login with Google (Recruiter)
          </Button>
          <span className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </>
  );
};
export default Login;
