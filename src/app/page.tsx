import Posts from "@/components/posts";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Image from "next/image";
import Link from "next/link";
import { getFeed } from "@/controllers/posts";

import { ImageIcon, Link2Icon } from "@radix-ui/react-icons";
import { getUserById } from "@/controllers/users";
import { getRedditRecommendations } from "@/controllers/reddits";
import JoinReddit from "./r/[reddit]/joinReddit";
import { Suspense } from "react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const user = await getUserById(session.user.id);

  const posts = await getFeed(session.user.id);

  return (
    <section className="mt-3 grid w-full max-w-3xl grid-cols-3 justify-center gap-5 sm:px-5">
      <main className="col-span-3 md:col-span-2">
        <div className="mb-3 flex w-full items-center gap-2 rounded-sm border border-gray-400 bg-white p-2 py-2">
          <Image
            width={40}
            height={40}
            src={
              user?.imageId
                ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${user.imageId}`
                : session.user?.image ?? "/r.svg"
            }
            className="rounded-full shadow shadow-gray-500"
            alt="profile picture"
          />
          <Link
            className="group w-full rounded-sm border border-gray-200 bg-gray-100 p-1 px-2 hover:border-blue-500 hover:bg-white"
            href="/post"
          >
            <div className="w-full text-sm font-bold text-black/40 group-hover:text-blue-500">
              Create Post
            </div>
          </Link>
          <Link
            href="/post?m=image"
            className="rounded-sm p-1 hover:bg-gray-100 hover:text-blue-500"
          >
            <ImageIcon width={25} height={25} />
          </Link>
          <Link
            href="/post?m=image"
            className="rounded-sm p-1 hover:bg-gray-100 hover:text-blue-500"
          >
            <Link2Icon width={25} height={25} />
          </Link>
        </div>
        <Posts posts={posts} />
      </main>
      <aside className="w-max-[10rem] hidden h-max flex-col items-center justify-center gap-3 md:col-span-1 md:flex">
        <HomeAside />
        <Suspense>
          <RedditRecommendations userId={session.user.id} />
        </Suspense>
      </aside>
    </section>
  );
}

const HomeAside = () => {
  return (
    <div className="w-full flex-col rounded-sm border border-slate-500 bg-white md:flex">
      <picture className="relative h-7">
        <Image
          fill={true}
          style={{ objectFit: "cover" }}
          src="/home_banner.png"
          alt="Reddit Banner"
        />
      </picture>
      <div className="relative bottom-2 left-2">
        <div className="flex items-end justify-start gap-3">
          <Image width={40} height={40} src="/toy.png" alt="Reddit Banner" />
          <h1 className="w-full rounded-tl-sm rounded-tr-sm text-left text-sm font-bold">
            HOME
          </h1>
        </div>
      </div>
      <p className="p-2 text-xs">
        Your personal Reddit frontpage. Come here to check in with your favorite
        communities.
      </p>
      <hr className="w-5/6 self-center" />
      <div className="flex flex-col gap-2 p-2">
        <Link
          href="/post"
          className="rounded-full border border-background bg-blue-500 py-[0.15rem] text-center text-xs font-bold text-white hover:bg-blue-400"
        >
          Create Post
        </Link>
        <Link
          href="/r/create"
          className="rounded-full border border-blue-500 bg-white py-[0.15rem] text-center text-xs font-bold text-blue-500 hover:bg-gray-100"
        >
          Create Community
        </Link>
      </div>
    </div>
  );
};

const RedditRecommendations = async ({ userId }: { userId: number }) => {
  const reddits = await getRedditRecommendations(userId);
  if (reddits.length == 0) return;

  return (
    <div className="w-full flex-col items-center justify-center rounded-sm border border-slate-500 bg-white md:flex">
      <h2 className="base w-full bg-blue-500 px-3 py-1 text-left text-sm font-bold text-white">
        Popular Communities
      </h2>
      <ul className="w-full px-2">
        {reddits.map((r) => (
          <li
            key={r.redditId}
            className="my-2 flex w-full items-center justify-between gap-2"
          >
            <div className="overlflow-hidden flex w-4/6 items-center justify-start gap-2">
              <picture className="min-h-fit min-w-fit">
                <Image
                  loading="lazy"
                  className="rounded-full"
                  width={35}
                  height={35}
                  src={
                    r.imageId
                      ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${r.imageId}`
                      : "/r.svg"
                  }
                  alt="reddit icon"
                />
              </picture>
              <Link
                href={`/r/${r.reddit}`}
                className="overflow-hidden overflow-ellipsis text-xs hover:underline"
              >
                r/{r.reddit}
              </Link>
            </div>
            <JoinReddit
              redditId={r.redditId}
              className="min-w-[3rem] max-w-[20%]"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
