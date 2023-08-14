"use client";
import Dialog, { modalProps } from "@/components/dialog";
import { signOut, useSession } from "next-auth/react";
import { FC, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";
import InputImage from "@/components/inputImage";

import * as Tabs from "@radix-ui/react-tabs";

interface editPageProps {}

const EditPage: FC<editPageProps> = () => {
  const session = useSession();
  if (session.status == "unauthenticated") return;

  return (
    <Tabs.Root
      className="mt-2 w-full bg-white sm:min-w-[30rem] md:w-3/4 md:max-w-2xl"
      defaultValue="edit"
    >
      <Tabs.List className="grid w-full grid-cols-2 border-b border-gray-200">
        <Tabs.Trigger
          value="edit"
          className="align-center flex justify-center gap-2 p-3 font-bold hover:bg-gray-100 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-100/40 data-[state=active]:text-blue-500"
        >
          Edit
        </Tabs.Trigger>
        <Tabs.Trigger
          value="account"
          className="align-center flex justify-center gap-2 p-3 font-bold hover:bg-gray-100 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-100/40 data-[state=active]:text-blue-500"
        >
          Account
        </Tabs.Trigger>
      </Tabs.List>
      <div className="p-4">
        <Tabs.Content
          className="flex flex-col items-center justify-center gap-2"
          value="account"
        >
          <button
            onClick={() => signOut()}
            className="w-1/3 rounded-full border border-background bg-blue-500 py-[0.15rem] text-center text-sm font-bold text-white hover:bg-blue-400"
          >
            Sign Out
          </button>
          <Dialog Modal={removeModal} modalClassName="max-w-xs text-center p-3">
            <button className="w-1/3 rounded-full border border-red-500 bg-white py-[0.15rem] text-center text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white">
              Delete Account
            </button>
          </Dialog>
        </Tabs.Content>
        <Tabs.Content className="flex flex-col gap-2" value="edit">
          <EditProfile />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
};

const removeModal = () => {
  const deleteAccount = () => {
    fetch("/api/u", { method: "DELETE" }).then(() => signOut());
  };
  return (
    <div className="text-balance flex max-w-xs flex-col gap-3">
      <h1>Are you sure you want to delete your account?</h1>
      <button
        onClick={() => deleteAccount()}
        className="w-auto rounded-full border border-red-500 bg-white p-4 py-[0.15rem] text-center text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white focus:bg-gray-100 focus:outline-none"
      >
        Delete Account
      </button>
    </div>
  );
};

const EditProfile = () => {
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
          maxLength={21}
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
          className="w-1/3 rounded-full border border-gray-200 bg-blue-500 py-[0.15rem] text-sm font-bold text-white hover:bg-blue-400"
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

export default EditPage;
