"use client";
import { modalProps } from "@/components/dialog";
import { signOut, useSession } from "next-auth/react";
import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import InputImage from "./inputImage";

const EditUserModal: FC<modalProps<{}>> = ({ setOpen }) => {
  const session = useSession();
  if (session.status == "unauthenticated") return;

  const deleteAccount = () => {
    fetch("/api/u", { method: "DELETE" }).then(() => signOut());
  };

  return (
    <>
      <h1 className="text-2xl">User Configuration</h1>
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
      <EditProfile setOpen={setOpen} />
    </>
  );
};

const EditProfile = ({
  setOpen,
}: {
  setOpen?: Dispatch<SetStateAction<boolean>>;
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

    if (setOpen) setOpen(false);

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

export default EditUserModal;
