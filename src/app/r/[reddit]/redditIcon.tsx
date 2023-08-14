"use client";
import Spinner from "@/components/spinner";
import { modalProps } from "@/components/dialog";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useState } from "react";
import InputImage from "@/components/inputImage";

const EditReddit: FC<modalProps<{ redditId: number }>> = ({
  setOpen,
  props,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setError("");
    setLoading(true);

    const res = await fetch(`/api/r/${props?.redditId}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      console.log("error");
      setError(data.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    if (setOpen) setOpen(false);
    router.refresh();
  };

  return (
    <>
      <h1>Update reddit</h1>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
        <label className="flex flex-col">
          <h2 className="text-sm">Update icon</h2>
          <InputImage
            name="image"
            className="w-full rounded border border-gray-200 px-3 py-2"
          />
        </label>
        <label>
          <h2 className="text-sm">Update banner</h2>
          <InputImage
            name="banner"
            className="w-full rounded border border-gray-200 px-3 py-2"
          />
        </label>
        {loading ? (
          <Spinner />
        ) : (
          <input
            type="submit"
            className="rounded-full border border-gray-200 bg-blue-500 py-[0.15rem] text-xs font-bold text-white hover:bg-blue-400"
            value="Save changes"
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
    </>
  );
};

export default EditReddit;
