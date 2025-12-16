import { Avatar, AvatarFallback } from "../../ui/avatar";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import PostCreator from "./PostCreator";
import EditProfile from "./EditProfile";
import Image from "next/image";

export interface User {
  name: string;
  email: string;
  image: string;
  department?: string;
  bio?: string;
}

interface Props {
  user: User;
}

export default function UserInformation({ user }: Props) {
  const [currentUser, setUser] = useState<User>(user); // <-- local state
  const [firstName, ...rest] = currentUser.name.split(" ");
  const lastName = rest.join(" ");

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border border-gray-200 py-6 px-6 space-y-3 shadow-sm">
      {/* Avatar */}
      <Avatar className="w-20 h-20">
        {currentUser.image ? (
          <Image
            src={currentUser.image}
            alt={currentUser.name}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        ) : (
          <AvatarFallback className="flex items-center justify-center bg-[#003768] text-white font-bold w-full h-full rounded-full">
            {firstName.charAt(0)}
            {lastName.charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>

      {/* User Info */}
      <div className="text-center space-y-1">
        <p className="font-semibold text-[#003768] text-lg">
          {firstName} {lastName}
        </p>
        <p className="text-sm text-gray-600">{currentUser.email}</p>
        {currentUser.department && (
          <p className="text-sm text-gray-700 font-medium">
            Department: {currentUser.department}
          </p>
        )}
        {currentUser.bio && (
          <p className="text-sm text-gray-500 italic">{currentUser.bio}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4 w-full">
        <Button
          variant="outline"
          className="w-full md:w-1/2 border-[#003768] text-[#003768] hover:bg-[#FDB813] hover:text-white transition"
          onClick={() => setShowCreatePost(true)}
        >
          Create Post
        </Button>
        <Button
          variant="outline"
          className="w-full md:w-1/2 border-[#003768] text-[#003768] hover:bg-[#FDB813] hover:text-white transition"
          onClick={() => setShowEditProfile(true)}
        >
          Edit Profile
        </Button>
      </div>

      {/* Modals */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
            <PostCreator
              user={currentUser}
              onClose={() => setShowCreatePost(false)}
            />
          </div>
        </div>
      )}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
            <EditProfile
              user={currentUser}
              onClose={() => setShowEditProfile(false)}
              onUserUpdated={setUser} // <-- this is where your line goes
            />
          </div>
        </div>
      )}
    </div>
  );
}
