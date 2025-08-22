import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const res = await fetchPosts();
  const user = await currentUser();
  
  if (!user) return null;

  return (
    <>
      <section className="mt-9 flex flex-col gap-10">
        {res.posts.length === 0 ? (
          <p className="text-center text-base font-normal text-light-3">
            No threads found
          </p>
        ) : (
          <>
            {res.posts.map((post) => (
              <ThreadCard
                key={post.id}
                id={post.id}
                currentUserId={user.id}
                parentId={post.parentId}
                text={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                children={post.children}

              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
