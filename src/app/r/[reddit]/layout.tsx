import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchRedditData } from "./fetchRedditData";
import RemoveReddit from "./removeReddit";
import Link from "next/link";
import Image from "next/image";
import Reddit from "@/types/reddit";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Dialog from "@/components/dialog";
import EditReddit from "./redditIcon";
import JoinReddit from "./joinReddit";
import { RedditDataProvider } from "@/context/redditDataContext";

interface RedditProps {
  params: {
    reddit: string;
  };
  children: ReactNode;
}

const RedditLayout: FC<RedditProps> = async ({ children, params }) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const redditData = await fetchRedditData(params.reddit, session.user.id);

  if (!redditData) return <Reddit404 />;

  return (
    <div className="flex w-full flex-col items-center">
      <RedditNavbar reddit={redditData} />
      <section className="mt-3 grid w-full max-w-3xl grid-cols-3 justify-center gap-5 sm:px-5">
        <main className="col-span-3 lg:col-span-2">
          <RedditDataProvider redditData={redditData}>
            {children}
          </RedditDataProvider>
        </main>
        <AboutReddit reddit={redditData} />
      </section>
    </div>
  );
};

const Reddit404 = () => {
  return (
    <div className="flex h-2/3 flex-col items-center justify-center gap-5 text-center">
      <div>
        <h1 className="font-bold">
          Sorry, there aren&apos;t any communities on Reddit with that name.
        </h1>
        <h2 className="opacity-60">
          {" "}
          This community may have been banned or the community name is
          incorrect.{" "}
        </h2>
      </div>
      <div className="flex gap-5">
        <Link
          href="/r/create"
          className="rounded-3xl border-2 border-background bg-blue-500 px-5 py-[0.15rem] text-sm font-bold text-white transition-all duration-100 hover:border-blue-500 hover:bg-white hover:text-blue-500 hover:shadow-md"
        >
          Create Community
        </Link>
        <Link
          href="/"
          className="rounded-3xl border-2 border-background bg-blue-500 px-5 py-[0.15rem] text-sm font-bold text-white transition-all duration-100 hover:border-blue-500 hover:bg-white hover:text-blue-500 hover:shadow-md"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

const RedditNavbar = ({ reddit }: { reddit: Reddit }) => {
  return (
    <section
      className={twMerge(
        "relative flex w-full max-w-full flex-col items-center bg-white",
        reddit.bannerId ? "h-52" : "h-36",
      )}
    >
      <picture
        className={twMerge(
          "relative mb-5 min-h-[60%] w-screen",
          reddit.bannerId ? "min-h-[70%]" : "min-h-[55%] bg-blue-500",
        )}
      >
        {reddit.bannerId ? (
          <Image
            loading="lazy"
            priority={false}
            quality={100}
            src={`https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${reddit.bannerId}`}
            sizes="(min-width: 800px) 2500px, 1500px"
            fill
            className="object-cover"
            alt="Reddit Banner"
          />
        ) : (
          ""
        )}
      </picture>
      <div
        className={twMerge(
          "absolute flex w-full max-w-3xl items-end justify-start gap-2 px-2 sm:px-5",
          reddit.bannerId ? "top-[65%]" : "top-[50%]",
        )}
      >
        <picture className="relative h-16 w-16 max-w-full rounded-full bg-white">
          <Dialog<{ redditId: number }>
            Modal={EditReddit}
            modalProps={{ redditId: reddit.id }}
          >
            <Image
              className="min-h-[80px] min-w-[80px] rounded-full border-4 border-white"
              loading="lazy"
              src={
                !!reddit.imageId
                  ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${reddit.imageId}`
                  : "/r.svg"
              }
              width={100}
              height={100}
              alt="profile picture"
            />
          </Dialog>
        </picture>
        <div className="w-3/4 md:w-full">
          <div className="flex max-w-fit items-center justify-center gap-3">
            <h1 className="overflow-hidden overflow-ellipsis text-2xl font-bold md:text-3xl">
              {reddit.name}
            </h1>
            <JoinReddit redditId={reddit.id} />
          </div>
          <h1 className="text-xs font-bold text-text/60">r/{reddit.name}</h1>
        </div>
      </div>
    </section>
  );
};

const AboutReddit = ({ reddit }: { reddit: Reddit }) => {
  return (
    <aside className="hidden h-max flex-col rounded-sm border border-slate-500 bg-white lg:col-span-1 lg:flex">
      <h1 className="w-full rounded-tl-sm rounded-tr-sm bg-blue-500 px-2 py-2 text-left text-sm font-bold text-white ">
        About community
      </h1>
      <div className="flex flex-col gap-2 p-2">
        <p className="text-xs">{reddit.description}</p>
        <p className="text-sm text-text/70">
          Created: {reddit.createdAt.toDateString().slice(4)}
        </p>
        <p className="text-sm text-text/70">Members: {reddit.member_count}</p>
        <Link
          href={`/post?r=${reddit.id}`}
          className="mt-2 overflow-hidden overflow-ellipsis rounded-xl bg-blue-500 px-2 py-1 text-center text-sm font-bold text-white hover:shadow-md"
        >
          Post on r/{reddit.name}
        </Link>
        <RemoveReddit redditId={reddit.id} />
      </div>
    </aside>
  );
};

export default RedditLayout;
