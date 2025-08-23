import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";


async function Page() {
  const user = await currentUser();
  if(!user) return null

  const userInfo = await fetchUser(user?.id);
  if(!userInfo) return null

  const userData = {
    id: user?.id,
    objectId: userInfo.id,
    username: userInfo.username,
    name: userInfo.name || user.firstName || "",
    bio: userInfo.bio || "",
    image: user.imageUrl || '/assets/profile.svg',
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <p className="mt-3 text-base ">Onboard</p>
      <section className="mt-9 bg-[#121417] p-10">
        <AccountProfile user={userData} btnTitle=""/>
      </section>
    </main>
  );
}
export default Page;
