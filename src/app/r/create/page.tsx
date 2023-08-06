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

    const res = await fetch("/api/r/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.log("error");
      setError(data.message);
      setLoading(false);
      return;
    }

    router.push(`/r/${formData.get("name")}`);
  };

  return (
    <div className="mx-2 mt-3 flex w-full flex-col items-center md:mx-0">
      <form
        onSubmit={handleSubmit}
        className="mx-1 flex w-full max-w-2xl flex-col items-center justify-center gap-5 rounded-sm bg-white p-5 shadow-xl shadow-gray-300 md:w-3/4"
      >
        <div className="relative flex w-full">
          <span className="absolute left-2 top-1/2 -translate-y-2/4 transform text-xl">
            r/
          </span>
          <input
            type="text"
            name="name"
            required
            maxLength={21}
            className="w-full rounded border border-gray-200 py-2 pl-6"
          />
        </div>
        <input
          type="text"
          name="description"
          placeholder="description"
          className="w-full rounded border border-gray-200 p-3"
        />
        {loading ? (
          <Spinner />
        ) : (
          <input
            type="submit"
            value="Create Community"
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