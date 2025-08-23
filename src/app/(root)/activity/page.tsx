import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/user.action";



async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboard");

  const activity = await getActivity(userInfo.id);

  return (
    <>
      <h1 className='leading-[140%] font-semibold text-white'>Activity</h1>

      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity.id} href={`/thread/${activity.parentId}`}>
                <article className='flex items-center gap-2 rounded-md bg-[#121417] px-7 py-4'>
                  <Image
                    src={activity.author.image ?? '/assets/profile.svg'}
                    alt='user_logo'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='text-xs font-normal text-white'>
                    <span className='mr-1 text-[#877EFF]'>
                      {activity.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='text-base text-[#877EFF]'>No activity yet</p>
        )}
      </section>
    </>
  );
}

export default Page;