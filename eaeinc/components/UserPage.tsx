import Header from "@/components/Header";
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
    <>
      {/* Header at the very top */}
      <Header user={user} />

      {/* Main content with spacing to avoid overlapping header */}
      <main className="mt-[120px] grid grid-cols-8 sm:px-5 gap-6">
        {/* Sidebar / User Info */}
        <section className="hidden md:inline md:col-span-2">
          <UserInformation user={user} />
        </section>

        {/* Forum / Posts */}
        <section className="col-span-8 md:col-span-6">
          <PostForum user={user} />
        </section>

        {/* Optional Widget */}
        <section>{/* Widget */}</section>
      </main>
    </>
  );
}
