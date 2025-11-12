import UserInformation from "@/components/UserInformation";

export default function UserPage() {
  return (
    <main className="grid grid-cols-8 mt-5 sm:px-5">
      <section className="hidden md:inline md:col-span-2">
        <UserInformation />
      </section>

      <section>
        {/* PostForm */}
        {/* PostFeed */}
      </section>

      <section>{/* Widget */}</section>
    </main>
  );
}
