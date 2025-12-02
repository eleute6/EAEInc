import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import React from "react";
import { Button } from "./ui/button";

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

      <div className="flex gap-3 mt-4 w-full">
        <Button variant="outline" className="w-full md:w-1/2">
          Create Post
        </Button>
        <Button variant="outline" className="w-full md:w-1/2">
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
