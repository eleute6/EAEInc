import Header from "@/components/Header"; // adjust the path
import UserInformation from "./UserInformation";
import PostForum from "./PostForum";

interface User {
  name: string;
  email: string;
  picture: string;
}

interface Props {
  user: User;
}

export default function UserPage({ user }: Props) {
  return (
    <main className="grid grid-cols-8 mt-5 sm:px-5">
      <section className="col-span-8">
        <Header />
      </section>

      <section className="hidden md:inline md:col-span-2">
        <UserInformation user={user} />
      </section>

      {/* Main Content / Forum */}
      <section className="col-span-8 md:col-span-6">
        <PostForum user={user} />
      </section>

      <section>{/* Widget */}</section>
    </main>
  );
}
