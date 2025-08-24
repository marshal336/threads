import { redirect } from "next/navigation";

import { fetchUserPosts } from "@/lib/actions/user.action";
import { fetchCommunityPosts } from "@/lib/actions/community.action";

import ThreadCard from "../cards/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: "User" | "Community";
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
  let result: any;
  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {/* @ts-ignore */}
      {result.threads.map((thread) => (
        <ThreadCard
          key={thread.id}
          id={thread.id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          text={thread.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result!.image, id: result!.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result!.name, id: result!.id, image: result!.image }
              : thread.community
          }
          createdAt={new Date(thread.createdAt)}
          children={thread.children}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;
