import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUser } from "@/lib/actions/user.action";
import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";

async function Page({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params; // 👈 деструктурим после await
  if (!id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(id);
  if (!userInfo?.onboarded) redirect("/onboard");

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image ?? '/assets/profile.svg'}
        bio={userInfo.bio ?? ''}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full ">
          <TabsList className=" flex min-h-[50px] flex-1 items-center gap-3 bg-[#121417] text-[#EFEFEF] data-[state=active]:bg-[#0e0e12] data-[state=active]:text-[#EFEFEF]">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className=" flex min-h-[50px] flex-1 items-center gap-3 bg-[#121417] text-[#EFEFEF] data-[state=active]:bg-[#0e0e12] data-[state=active]:text-[#EFEFEF]">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-[#5C5C7B] px-2 py-1 leading-[140%] font-medium text-[#EFEFEF]">
                    {userInfo.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-white"
            >
              <ThreadsTab
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
export default Page;
