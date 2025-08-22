import React from "react";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import PostThread from "@/components/forms/PostThread";

interface IPageProps {
  className?: string;
}

export default async function Page({ className }: IPageProps) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboard");

  return (
    <>
      <h1 className="leading-[140%] font-bold text-white text-light-1 ">
        Create Thread
      </h1>
      <PostThread userId={userInfo.id} />
    </>
  );
}
