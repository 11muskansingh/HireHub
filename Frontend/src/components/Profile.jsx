import React from "react";
import Navbar from "./Shared/Navbar";
import { Contact, Mail, Pen } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import AppliedJobTable from "./AppliedJobTable";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const isResume = user?.profile?.resume ? true : false;
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p>{user?.profile?.bio || "Bio not provided"}</p>
            </div>
          </div>
          <Button
            //onClick={() => setOpen(true)}
            className="text-right"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>
              {user?.profile?.phoneNumber || "Phone number not provided"}
            </span>
          </div>
        </div>
        <div className="my-5">
          <Label className="text-md font-bold">Skills</Label>
          <div className="flex items-center gap-1">
            {user?.profile?.skills.length !== 0 ? (
              user?.profile?.skills.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            ) : (
              <span>No skills to show</span>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold">Resume</Label>
          {isResume ? (
            <a
              target="blank"
              href={user?.profile?.resume}
              className="text-blue-500 w-full hover:underline cursor-pointer"
            >
              {user?.profile?.resumeOriginalName}
            </a>
          ) : (
            <span>Resume not provided</span>
          )}
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl">
        <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
        {/* Applied Job Table   */}
        <AppliedJobTable />
      </div>
      {/* <UpdateProfileDialog open={open} setOpen={setOpen} /> */}
    </>
  );
};

export default Profile;
