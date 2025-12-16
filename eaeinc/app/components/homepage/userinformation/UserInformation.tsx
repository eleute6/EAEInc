"use client";

import { Avatar, AvatarFallback } from "../../ui/avatar";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import PostCreator from "./PostCreator";
import EditProfile from "./EditProfile";
import Image from "next/image";
import { useSession } from "next-auth/react"; // ✅ import session hook

export interface User {
  name: string;
  email: string;
  image: string;
  department?: string;
  bio?: string;
}

export default function UserInformation() {
  const { data: session } = useSession(); // ✅ get live session
  const user = session?.user as User | undefined;

  // local state for immediate updates from EditProfile
  const [currentUser, setUser] = useState<User | undefined>(user);

  if (!user) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-gray-500">Loading user information...</p>
      </div>
    );
  }

  // fall back to session user if local state not yet set
  const displayUser = currentUser || user;
  const [firstName, ...rest] = displayUser.name.split(" ");
  const lastName = rest.join(" ");

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border border-gray-200 py-6 px-6 space-y-3 shadow-sm">
      {/* Avatar */}
      <Avatar className="w-20 h-20">
        {displayUser.image ? (
          <Image
            src={displayUser.image}
            alt={displayUser.name}
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
        <p className="text-sm text-gray-600">{displayUser.email}</p>
        {displayUser.department && (
          <p className="text-sm text-gray-700 font-medium">
            Department: {displayUser.department}
          </p>
        )}
        {displayUser.bio && (
          <p className="text-sm text-gray-500 italic">{displayUser.bio}</p>
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
              user={displayUser}
              onClose={() => setShowCreatePost(false)}
            />
          </div>
        </div>
      )}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
            <EditProfile
              user={displayUser}
              onClose={() => setShowEditProfile(false)}
              onUserUpdated={setUser} // ✅ updates local state immediately
            />
          </div>
        </div>
      )}
    </div>
  );
}
