"use client";
import { Session } from "next-auth/core/types";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useSession, signOut } from "next-auth/react";
import { FormEvent } from "react";

const ProfilePic = ({ session }: { session: Session }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="focus:outline-none">
        <Image
          src={`${session.user?.image}`}
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
          <button className="rounded-full border border-red-500 bg-white py-[0.15rem] text-center text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white">
            Delete Account
          </button>
          <hr />
          <h2 className="text-xl">Edit Profile</h2>
          <EditProfile />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const EditProfile = () => {
  const session = useSession();
  if (!session) return;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    return;
  };

  return (
    <form className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <h2 className="text-xs font-bold ">Username</h2>
        <input
          type="text"
          className="border border-gray-200 p-1"
          defaultValue={session.data?.user.name ?? ""}
          name="username"
        />
      </label>
      <label className="flex flex-col gap-1">
        <h2 className="text-xs font-bold ">Profile picture</h2>
        <input
          type="file"
          className="border border-gray-200 p-1"
          name="image"
        />
      </label>
      <input
        type="submit"
        className="rounded-full border border-gray-200 bg-blue-500 py-[0.15rem] text-xs font-bold text-white hover:bg-blue-400"
        value="Save changes"
      />
    </form>
  );
};

export default ProfilePic;
