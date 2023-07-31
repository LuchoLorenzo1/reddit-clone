"use client";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useState } from "react";

const Page: FC<{}> = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    (e.target as HTMLFormElement).reset();

    setLoading(true);

    const res = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data.message);
      return;
    }

    setLoading(false);
    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-5 flex flex-col items-center justify-center gap-5 bg-zinc-500 p-5 "
    >
      <input
        type="text"
        name="title"
        placeholder="title"
        required
        className="w-full p-3 dark:bg-zinc-800 dark:text-white"
      />
      <input
        type="text"
        name="content"
        placeholder="content"
        required
        className="w-full p-3 dark:bg-zinc-800 dark:text-white"
      />
      {loading ? (
        <Spinner />
      ) : (
        <input
          type="submit"
          value="CREATE"
          className="w-2/4 bg-teal-300 p-1 font-bold text-white transition-all hover:bg-teal-400 hover:text-zinc-500"
        />
      )}
    </form>
  );
};

const Spinner = () => {
  return (
    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-zinc-900 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:border-zinc-200 dark:border-r-transparent" />
  );
};

export default Page;
