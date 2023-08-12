"use client";
import Spinner from "@/components/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  FC,
  FormEvent,
  useState,
  forwardRef,
  ReactNode,
  Ref,
  useEffect,
} from "react";

import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useReddits } from "@/context/redditsContext";

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
        redditId: formData.get("redditId"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message);
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="mx-2 mt-3 flex w-full flex-col items-center md:mx-0">
      <form
        onSubmit={handleSubmit}
        className="mx-1 flex w-full max-w-2xl flex-col items-center justify-center gap-5 rounded-sm bg-white p-5 shadow-xl shadow-gray-300 md:w-3/4"
      >
        <div className="flex w-full flex-col items-start gap-5">
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
          <RedditSelector />
        </div>
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

const RedditSelector = () => {
  const { reddits } = useReddits();
  const [value, setValue] = useState<string | undefined>();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("r");
    if (
      id &&
      !isNaN(parseFloat(id)) &&
      !!reddits.find((r) => r.redditId == +id)
    ) {
      setValue(id);
    }
  }, [reddits, searchParams]);

  return (
    <Select.Root value={value} required name="redditId">
      <Select.Trigger
        className="flex min-w-[15rem] items-center justify-between gap-2 rounded border border-gray-200 px-3 py-2"
        aria-label="Community"
      >
        <Select.Value placeholder={<SelectPlaceholder />} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="max-h-32 w-60 overflow-hidden rounded border border-x-2 border-gray-200 bg-white"
          sideOffset={0}
          position="popper"
        >
          <Select.ScrollUpButton className="flex items-center justify-center">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport>
            <Select.Group>
              {reddits.map((r) => (
                <SelectItem key={r.redditId} value={r.redditId}>
                  <div className="flex w-full items-center gap-3">
                    <Image
                      className="rounded-full"
                      width={25}
                      height={25}
                      src={
                        r.imageId
                          ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${r.imageId}`
                          : "/r.svg"
                      }
                      alt="subreddit option image"
                    />
                    <h1 className="text-sm">r/{r.reddit}</h1>
                  </div>
                </SelectItem>
              ))}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = forwardRef(
  (
    { children, value }: { children: ReactNode; value: number },
    forwardedRef: Ref<HTMLDivElement>,
  ) => {
    return (
      <Select.Item
        className="flex items-center justify-start px-3 py-1 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
        value={value.toString()}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    );
  },
);

const SelectPlaceholder = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="max-h-[25px] min-h-[25px] min-w-[25px] max-w-[25px] rounded-full border-2 border-dashed border-black" />
      <h1 className="text-sm">Choose a community</h1>
    </div>
  );
};

export default Page;
