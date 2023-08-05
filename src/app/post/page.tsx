"use client";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useState } from "react";

const Page: FC<{}> = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    (e.target as HTMLFormElement).reset();

    setError("");
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
      console.log();
      setError(data.message);
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div
      onClick={() => setError("")}
      className="mx-2 mt-3 flex w-full flex-col items-center md:mx-0"
    >
      <form
        onSubmit={handleSubmit}
        className="mx-1 flex w-full max-w-2xl flex-col items-center justify-center gap-5 rounded-sm bg-white p-5 shadow-xl shadow-gray-300 md:w-3/4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          className="w-full rounded border border-gray-200 p-3"
        />
        <input
          type="text"
          name="content"
          placeholder="Text (optional)"
          className="w-full rounded border border-gray-200 p-3"
        />
        {loading ? (
          <Spinner />
        ) : (
          <input
            type="submit"
            value="Post"
            className="w-auto rounded-full bg-orange-500 p-1 px-5 text-base font-bold text-white transition-all duration-100 hover:bg-orange-600"
          />
        )}
        {error ? (
          <h1 className="rounded-md bg-red-500 p-2 text-center font-bold text-white">
            {error}
          </h1>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};

export default Page;
