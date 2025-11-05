import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import React from "react";

// WILL EVENTUALLY NEED TO HAVE ASYNC BEFORE IT
function UserInformation() {
  //const user = await currentUser();
  // Dummy user data for now
  const user = {
    firstName: "Alice",
    lastName: "Brown",
    imageUrl: "",
  };

  const firstName = user.firstName;
  const lastName = user.lastName;
  const imageUrl = user.imageUrl;

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

      {/* Dummy user info */}
      <div className="text-center">
        <p className="font-semibold">
          {firstName} {lastName}
        </p>
        <p className="text-sm text-gray-500">Faculty</p>
      </div>
    </div>
  );
}

export default UserInformation;
