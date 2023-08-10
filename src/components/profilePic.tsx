"use client";
import { Session } from "next-auth/core/types";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { Cross2Icon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import User from "@/types/user";
import InputImage from "./inputImage";

const ProfilePic = ({ session, user }: { session: Session; user?: User }) => {
  const [open, setOpen] = useState(false);

  const deleteAccount = () => {
    fetch("/api/u", { method: "DELETE" }).then(() => signOut());
  };

  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(!open)}>
      <Dialog.Trigger className="focus:outline-none">
        <Image
          src={
            user?.imageId
              ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${user.imageId}`
              : session.user?.image ?? "/r.svg"
          }
          width={40}
          height={40}
          alt="profile picture"
          className="min-w-[1.75rem] rounded-full"
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
          <Dialog.Title className="text-2xl">User Configuration</Dialog.Title>
          <hr />
          <button
            onClick={() => signOut()}
            className="rounded-full border border-background bg-blue-500 py-[0.15rem] text-center text-xs font-bold text-white hover:bg-blue-400"
          >
            Sign Out
          </button>
          <button
            onClick={() => deleteAccount()}
            className="rounded-full border border-red-500 bg-white py-[0.15rem] text-center text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
          >
            Delete Account
          </button>
          <hr />
          <h2 className="text-xl">Edit Profile</h2>
          <EditProfile user={user} setOpen={setOpen} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const EditProfile = ({
  setOpen,
  user,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  user?: User;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setError("");
    setLoading(true);

    const res = await fetch(`/api/u`, {
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
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col items-center gap-4"
    >
      <label className="flex w-full flex-col gap-1">
        <h2 className="text-xs font-bold">Username</h2>
        <input
          type="text"
          className="w-full border border-gray-200 p-1"
          defaultValue={user?.name ?? ""}
          name="name"
        />
      </label>
      <label className="flex w-full flex-col gap-1">
        <h2 className="text-xs font-bold ">Profile picture</h2>
        <InputImage
          name="image"
          className="w-full border border-gray-200 p-1"
        />
      </label>
      {loading ? (
        <Spinner />
      ) : (
        <input
          type="submit"
          className="w-full rounded-full border border-gray-200 bg-blue-500 py-[0.15rem] text-xs font-bold text-white hover:bg-blue-400"
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
  );
};

export default ProfilePic;
