import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs/server";
interface IPageProps {
  className?: string;
}

async function Page({ className }: IPageProps) {
  const user = await currentUser();
  const userInfo = {};
  const userData = {
    id: user?.id,
    objectId: userInfo._id,
    username: userInfo.username || user.username,
    name: userInfo.name || user?.firstName || "",
    bio: userInfo.bio || "",
    image: user?.imageUrl || userInfo.image,
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
