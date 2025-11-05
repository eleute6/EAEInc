import UserInformation from "@/components/UserInformation";

export default function Home() {
  return (
    <main className="flex">
      <section>
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
