import Posts from "@/components/posts";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Image from "next/image";
import Link from "next/link";
import { getFeed } from "@/controllers/posts";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) return;

  const posts = await getFeed(session.user.id);

  return (
    <section className="mt-3 grid w-full max-w-3xl grid-cols-3 justify-center gap-5 sm:px-5">
      <main className="col-span-3 md:col-span-2">
        <Posts posts={posts} />
      </main>
      <HomeAside />
    </section>
  );
}

const HomeAside = () => {
  return (
    <aside className="w-max-[10rem] hidden h-max flex-col rounded-sm border border-slate-500 bg-white md:col-span-1 md:flex">
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
    </aside>
  );
};
