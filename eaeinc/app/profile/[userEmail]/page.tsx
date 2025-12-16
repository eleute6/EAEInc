// app/profile/[userEmail]/page.tsx
import { fetchUserByEmail, fetchApprovedUploadsByUser } from "@/app/serverfuns";
import Image from "next/image";

export default async function ProfilePage(props: {
  params: Promise<{ userEmail: string }>;
}) {
  // Await params because Next.js 16 passes it as a Promise
  const { userEmail } = await props.params;
  const decodedEmail = decodeURIComponent(userEmail);

  // Fetch user info and approved uploads
  const user = await fetchUserByEmail(decodedEmail);
  const uploads = await fetchApprovedUploadsByUser(decodedEmail);

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
      {uploads.length === 0 ? (
        <p className="text-gray-500 mt-2">No approved uploads yet.</p>
      ) : (
        <div className="mt-4 max-h-[600px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploads.map((u) => (
              <div
                key={u.id}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <p className="font-medium text-lg">{u.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{u.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Uploaded: {new Date(u.date).toLocaleDateString()}
                  </p>
                </div>
                {u.file && (
                  <a
                    href={u.file}
                    className="mt-3 text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View File
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
