import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import ThreadCard from "@/components/cards/ThreadCard";

import { fetchUser } from "@/lib/actions/user.action";
import { fetchThreadById } from "@/lib/actions/thread.action";
import Comment from "@/components/forms/Comment";

export const revalidate = 0;

export async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 👈 деструктурим после await
  if (!id) return null;
  
  const post = await fetchThreadById(id);
  if (!post) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboard");
  
  return (
    <section className="relative">
      <div>
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
      </div>

      <div className="mt-7">
        <Comment
          threadId={id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo.id)}
        />
      </div>

      <div className="mt-10">
        {post.children.map((childItem) => (
          <ThreadCard
            key={childItem.id}
            id={childItem.id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            text={childItem.text}
            author={childItem.author}
            community={post.community}
            createdAt={childItem.createdAt}
            children={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;
