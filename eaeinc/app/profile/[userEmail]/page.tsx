import { fetchUserByEmail } from "@/app/serverfuns";
import Image from "next/image";
import UserUploads from "./UserUploads";

export default async function ProfilePage(props: {
  params: Promise<{ userEmail: string }>;
}) {
  const { userEmail } = await props.params;
  const decodedEmail = decodeURIComponent(userEmail);

  const user = await fetchUserByEmail(decodedEmail);

  if (!user) {
    return <div className="p-6 text-red-600">User not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-24">
      {/* Profile header */}
      <div className="flex items-center space-x-6">
        <Image
          src={user.image}
          alt={user.name}
          width={100}
          height={100}
          className="rounded-full border-2 border-[#FFC72C]"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#002855]">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">
            Department: {user.department || "Not provided"}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-6 text-gray-700">{user.bio || "No bio provided."}</p>

      {/* Approved uploads */}
      <h2 className="text-2xl font-semibold mt-10 text-[#002855]">
        Approved Instrument Uploads
      </h2>
      <UserUploads email={user.email} />
    </div>
  );
}
