import React from "react";
async function UserInformation() {
  //const user = await currentUser()
  const initials = "AB";
  return (
    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-md shadow-sm">
      {/* Avatar */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-lg">
        {initials}
      </div>

      {/* User info placeholder */}
      <div>
        <p className="font-semibold">First Last</p>
        <p className="text-sm text-gray-500">Faculty</p>
      </div>
    </div>
  );
}

export default UserInformation;
