import Header from "@/app/components/Header";
import UserInformation from "./userinformation/UserInformation";
import PostForum from "./PostForum";
import HelpfulResources from "./HelpfulResources";
import ContributionLeaderboard from "./ContributionLeaderboard";
import UpcomingEvents from "./UpcomingEvents";
import { fetchPosts } from "@/app/serverfuns";

interface User {
  name: string;
  email: string;
  image: string;
}

interface Props {
  user: User;
}

export default function UserPage({ user }: Props) {
  return (
    <>
      {/* Header at the top */}
      <Header user={user} />

      {/* Main content with spacing below header */}
      <main className="mt-[120px] grid grid-cols-8 sm:px-5 gap-6">
        {/* Left sidebar: user info + leaderboard */}
        <section className="hidden lg:flex lg:flex-col lg:col-span-2 space-y-8">
          <UserInformation user={user} />
          <ContributionLeaderboard />
        </section>

        {/* Center: main post forum */}
        <section className="col-span-full md:col-span-4 xl:max-w-xl mx-auto w-full h-[calc(100vh-100px)] overflow-hidden">
          <PostForum user={user} />
        </section>

        {/* Right sidebar: helpful resources */}
        <section className="hidden lg:flex lg:flex-col lg:col-span-2 space-y-8">
          <HelpfulResources />
          <UpcomingEvents />
        </section>
      </main>
    </>
  );
}
