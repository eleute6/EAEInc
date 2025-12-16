// app/profile/[userEmail]/page.tsx
/*import { fetchUserByEmail } from "@/app/serverfuns";
import Image from "next/image";

export default async function ProfilePage(props: {
  params: Promise<{ userEmail: string }>;
}) {
  // Await the params object
  const { userEmail } = await props.params;

  // Fetch user by email
  const user = await fetchUserByEmail(userEmail);

  if (!user) {
    return <div className="p-6 text-red-600">User not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-24">
      <div className="flex items-center space-x-4">
        <Image
          src={user.image}
          alt={user.name}
          width={80}
          height={80}
          className="rounded-full border-2 border-[#FFC72C]"
        />
        <div>
          <h1 className="text-2xl font-bold text-[#002855]">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <p className="mt-4">{user.bio || "No bio provided."}</p>
    </div>
  );
}*/
// app/profile/[userEmail]/page.tsx
import { fetchUserByEmail } from "@/app/serverfuns";
import Image from "next/image";

export default async function ProfilePage(props: {
  params: Promise<{ userEmail: string }>;
}) {
  const { userEmail } = await props.params;

  // Decode the email so %40 becomes @
  const decodedEmail = decodeURIComponent(userEmail);

  const user = await fetchUserByEmail(decodedEmail);

  if (!user) {
    return <div className="p-6 text-red-600">User not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-24">
      <div className="flex items-center space-x-4">
        <Image
          src={user.image}
          alt={user.name}
          width={80}
          height={80}
          className="rounded-full border-2 border-[#FFC72C]"
        />
        <div>
          <h1 className="text-2xl font-bold text-[#002855]">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <p className="text-gray-600">
        Department: {user.department || "Not provided"}
      </p>
      <p className="mt-4">{user.bio || "No bio provided."}</p>
    </div>
  );
}
