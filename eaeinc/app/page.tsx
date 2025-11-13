import ContributionLeaderboard from "@/components/ContributionLeaderboard";
import HelpfulResources from "@/components/HelpfulResources";
import PostForum from "@/components/PostForum";
import UpcomingEvents from "@/components/UpcomingEvents";
import UserInformation from "@/components/UserInformation";

export default function Home() {
  return (
    <main className="grid grid-cols-8 mt-5 sm:px-5 gap-6">
      {/* Left sidebar: user info */}
      <section className="hidden md:flex md:flex-col md:col-span-2 space-y-8">
        <UserInformation />
        <ContributionLeaderboard />
      </section>

      {/* Center: main post forum */}
      <section className="col-span-full md:col-span-4 xl:max-w-xl mx-auto w-full h-[calc(100vh-100px)] overflow-hidden">
        <PostForum />
      </section>

      {/* Right sidebar: helpful resources */}
      <section className="hidden lg:flex lg:flex-col lg:col-span-2 space-y-8">
        <HelpfulResources />
        <UpcomingEvents />
      </section>
    </main>
  );
}
