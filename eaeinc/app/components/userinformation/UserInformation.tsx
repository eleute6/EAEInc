import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import React, { useState } from "react";
import { Button } from "../ui/button";
import PostCreator from "./PostCreator";

interface User {
  name: string;
  email: string;
  picture: string;
}

interface Props {
  user: User;
}

export default function UserInformation({ user }: Props) {
  // Split full name into first and last
  const [firstName, ...rest] = user.name.split(" ");
  const lastName = rest.join(" ");

  const imageUrl = user.picture;

  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-4 px-6 space-y-2">
      <Avatar className="w-16 h-16">
        {imageUrl ? (
          <AvatarImage src={imageUrl} />
        ) : (
          <AvatarFallback className="flex items-center justify-center bg-blue-500 text-white font-bold w-full h-full rounded-full">
            {firstName.charAt(0)}
            {lastName.charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="text-center">
        <p className="font-semibold">
          {firstName} {lastName}
        </p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4 w-full">
        <Button
          variant="outline"
          className="w-full md:w-1/2"
          onClick={() => setShowCreatePost(true)}
        >
          Create Post
        </Button>
        <Button variant="outline" className="w-full md:w-1/2">
          Edit Profile
        </Button>
      </div>

      {/* Modal for creating post */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <PostCreator user={user} onClose={() => setShowCreatePost(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
