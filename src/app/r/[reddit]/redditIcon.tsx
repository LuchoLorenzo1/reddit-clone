"use client";
import Spinner from "@/components/spinner";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormEvent, useState } from "react";

const RedditIcon = ({
  imageId,
  redditId,
}: {
  imageId?: string;
  redditId: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setError("");
    setLoading(true);

    const res = await fetch(`/api/r/${redditId}`, {
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
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(!open)}>
      <Dialog.Trigger className="focus:outline-none">
        <Image
          className="rounded-full border-4 border-white"
          loading="lazy"
          quality={100}
          src={
            !!imageId
              ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${imageId}`
              : "/r.svg"
          }
          width={80}
          height={80}
          alt="profile picture"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 flex w-full max-w-md -translate-x-2/4 -translate-y-2/4 transform flex-col gap-4 rounded bg-white px-5 py-3 focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Close asChild>
            <button
              className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
          <Dialog.Title className="text-2xl">Update reddit</Dialog.Title>
          <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
            <label className="flex flex-col">
              Update icon
              <input type="file" name="image" />
            </label>
            <label>
              Update banner
              <input type="file" name="banner" />
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RedditIcon;
