import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

import { fetchUser } from "@/lib/actions/user.action";
import CommunityCard from "@/components/cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.action";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sP = await searchParams;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchCommunities({
    searchString: sP.q,
    pageNumber: sP?.page ? +sP.page : 1,
    pageSize: 25,
  });

  return (
    <>
      <h1 className="leading-[140%] font-semibold text-white">Communities</h1>

      <div className="mt-5">
        <Searchbar routeType="communities" />
      </div>

      <section className="mt-9 flex flex-wrap gap-4">
        {result.communities.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image ?? "/assets/profile.svg"}
                bio={community.bio ?? ""}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="communities"
        pageNumber={sP?.page ? +sP.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Page;
