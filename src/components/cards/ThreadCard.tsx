import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";

interface FetchPostsResult {
  id: string;
  currentUserId: string;
  text: string;
  createdAt: Date;
  parentId: string | null;

  author: {
    id: string;
    username?: string;
    name: string;
    image: string | null;
    bio?: string | null;
    onboarded?: boolean;
  };

  community: {
    id: string;
    name: string;
    image?: string | null;
  } | null;

  children?: {
    id: string;
    text: string;
    createdAt: Date;
    authorId: string;
    communityId: string | null;
    parentId: string | null;

    author: {
      id: string;
      name: string;
      image: string | null;
    };
  }[]
  isComment?: boolean;
}

function ThreadCard({
  id,
  currentUserId,
  parentId,
  text,
  author,
  community,
  createdAt,
  children,
  isComment,
}: FetchPostsResult) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image ?? "/assets/profile.svg"}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="relative mt-2 w-0.5 grow rounded-full bg-neutral-800" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base font-semibold text-white">
                {author.name}
              </h4>
            </Link>

            <p className="mt-2 leading-[140%] font-normal text-[#EFEFEF]">
              {text}
            </p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>

              {isComment && children && children.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-[#697C89]">
                    {children.length} repl{children.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {!isComment && children && children.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {children.slice(0, 2).map((comment, index) => (
            <Image
              key={comment.author.id}
              src={comment.author.image ?? "/assets/profile.svg"}
              alt={`user_${comment.author.id}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/thread/${id}`}>
            <p className="mt-1 leading-4 font-medium text-gray-1">
              {children.length} repl{children.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="leading-4 font-medium text-gray-[#697C89]">
            {formatDateString(String(createdAt))}
            {community && ` - ${community.name} Community`}
          </p>

          <Image
            src={community.image ?? "/assets/profile.svg"}
            alt={community.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
}

export default ThreadCard;
