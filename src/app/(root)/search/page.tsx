import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";


import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const user = await currentUser();
  const sP = await searchParams
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboard");

  const result = await fetchUsers({
    userId: user.id,
    searchString: sP.q,
    pageNumber: sP.page ? +sP.page : 1,
    pageSize: 8,
  });

  return (
    <section>
      <h1 className='leading-[140%] font-bold text-white mb-10'>Search</h1>

      <Searchbar routeType='search' />

      <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image ?? '/assets/profile.svg'}
                personType='User'
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        path='search'
        pageNumber={sP?.page ? +sP.page : 1}
        isNext={result.isNext}
      />
    </section>
  );
}

export default Page;