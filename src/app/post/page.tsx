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
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ImageIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import { useReddits } from "@/context/redditsContext";

import * as Tabs from "@radix-ui/react-tabs";
import InputImage from "@/components/inputImage";
import toast from "react-hot-toast";

const Page: FC<{}> = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("post");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("m");
    if (mode == "image") {
      setSelected("image");
    } else if (mode == "post") {
      setSelected("post");
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    (e.target as HTMLFormElement).reset();

    setError("");
    setLoading(true);

    if (selected == "image") {
      formData.delete("content");
    } else if (selected == "post") {
      formData.delete("image");
    } else {
      return;
    }

    const res = await fetch("/api/post", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error("An error ocurred posting", {
        position: "bottom-right",
        duration: 2000,
      });
      setError(data.message);
      setLoading(false);
      return;
    }

    toast.success("Posted succesfully", {
      position: "bottom-right",
      duration: 2000,
    });
    router.push("/");
  };

  return (
    <Tabs.Root
      value={selected}
      onValueChange={(v) => setSelected(v)}
      className="mt-3 flex w-full flex-col items-center rounded-sm bg-white shadow shadow-gray-300 md:mx-0 md:w-3/4 md:max-w-2xl"
      defaultValue="post"
    >
      <Tabs.List className="grid w-full grid-cols-3 border-b border-gray-200">
        <Tabs.Trigger
          value="post"
          className="align-center flex justify-center gap-2 p-3 font-bold hover:bg-gray-100 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-100/40 data-[state=active]:text-blue-500"
        >
          <FileTextIcon width={30} height={30} />
          Post
        </Tabs.Trigger>
        <Tabs.Trigger
          value="image"
          className="align-center flex justify-center gap-2 p-3 font-bold hover:bg-gray-100 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-100/40 data-[state=active]:text-blue-500"
        >
          <ImageIcon width={30} height={30} />
          Image
        </Tabs.Trigger>
      </Tabs.List>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center justify-center gap-5 px-5 py-3"
      >
        <section className="flex w-full flex-col items-start gap-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            maxLength={200}
            required
            className="h-8 w-full rounded border border-gray-200 px-2"
          />
          <Tabs.Content tabIndex={-1} value="post" className="w-full">
            <textarea
              name="content"
              maxLength={20000}
              placeholder="Text (optional)"
              className="block max-h-52 min-h-[4rem] w-full rounded border border-gray-200 p-2 text-xs"
            />
          </Tabs.Content>
          <Tabs.Content tabIndex={-1} value="image" className="w-full">
            <InputImage
              name="image"
              className="w-full rounded border border-gray-200 p-3"
            />
          </Tabs.Content>
          <PostRedditSelector />
        </section>

        {loading ? (
          <Spinner />
        ) : (
          <input
            type="submit"
            value="Post"
            className="w-auto rounded-full bg-blue-500 px-4 py-1 font-bold text-white transition-all duration-100 hover:bg-blue-600"
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
    </Tabs.Root>
  );
};

const PostRedditSelector = () => {
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
          className="max-h-32 w-60 overflow-hidden border border-x-2 border-gray-200 bg-white"
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
