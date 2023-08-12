"use client";

import { ReactNode, Ref, forwardRef, useEffect, useState } from "react";
import * as Select from "@radix-ui/react-select";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useReddits } from "@/context/redditsContext";

const Navigator = () => {
  const { reddits } = useReddits();
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState("Home");

  const onValueChange = (value: string) => router.push(value);

  useEffect(() => {
    const x = pathname.split("/").slice(1);
    if (x[0] == "r" && reddits.find((r) => r.reddit == x[1])) {
      setValue(pathname);
      return;
    }
    if (x[0] == "post") {
      setValue("/post");
      return;
    }
    setValue("/");
  }, [pathname, reddits]);

  return (
    <Select.Root value={value} defaultValue="/" onValueChange={onValueChange}>
      {" "}
      <Select.Trigger
        className="focus:border-gray active:border-gray flex min-w-[3rem] items-center justify-between gap-0 border border-white px-1 py-2 hover:border-gray-200 focus:outline-none md:min-w-[12rem] md:max-w-[12rem] md:gap-2"
        aria-label="Community"
      >
        <Select.Value className="focus:boder-white bg-red-500" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="max-h-52 min-w-[12rem] max-w-[12rem] overflow-hidden border bg-white text-xs hover:border-gray-200"
          sideOffset={0}
          position="popper"
        >
          <Select.ScrollUpButton className="flex items-center justify-center">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="">
            <Select.Group>
              <Select.Label className="pl-2 text-[.5rem] font-bold">
                NAVIGATE
              </Select.Label>
              <hr />

              <SelectItem value="/" name="Home" icon={<Home />} />
              <SelectItem
                value="/post"
                name="Post"
                icon={<PlusIcon width={25} height={25} />}
              />

              {reddits.length > 0 ? (
                <>
                  {" "}
                  <hr />{" "}
                  <Select.Label className="pl-2 text-[.5rem] font-bold">
                    {" "}
                    YOUR COMMUNITIES{" "}
                  </Select.Label>{" "}
                  <hr />{" "}
                </>
              ) : (
                ""
              )}
              {reddits.map((r) => (
                <SelectItem
                  value={`/r/${r.reddit}`}
                  name={r.reddit}
                  key={r.redditId}
                  imageId={r.imageId}
                />
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
    {
      value,
      icon,
      imageId,
      name,
    }: { value: string; icon?: ReactNode; imageId?: string; name: string },
    forwardedRef: Ref<HTMLDivElement>,
  ) => {
    return (
      <Select.Item
        className="flex items-center justify-start p-1 pl-2 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
        value={value}
        ref={forwardedRef}
      >
        <div className="flex items-center gap-2">
          <Select.ItemText>
            <div className="flex items-center gap-2">
              {icon ?? (
                <Image
                  className="rounded-full"
                  width={25}
                  height={25}
                  src={
                    imageId
                      ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${imageId}`
                      : "/r.svg"
                  }
                  alt="subreddit option image"
                />
              )}
              <h1 className="hidden text-xxs font-bold md:block">{name}</h1>
            </div>
          </Select.ItemText>
          <h1 className="block text-xxs font-bold md:hidden">{name}</h1>
        </div>
      </Select.Item>
    );
  },
);

const Home = () => {
  return (
    <svg
      fill="#000000"
      height="25px"
      width="25px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26.39 26.39"
    >
      <g>
        <g id="c14_house">
          <path
            d="M3.588,24.297c0,0-0.024,0.59,0.553,0.59c0.718,0,6.652-0.008,6.652-0.008l0.01-5.451c0,0-0.094-0.898,0.777-0.898h2.761
			c1.031,0,0.968,0.898,0.968,0.898l-0.012,5.434c0,0,5.628,0,6.512,0c0.732,0,0.699-0.734,0.699-0.734V14.076L13.33,5.913
			l-9.742,8.164C3.588,14.077,3.588,24.297,3.588,24.297z"
          />
          <path d="M0,13.317c0,0,0.826,1.524,2.631,0l10.781-9.121l10.107,9.064c2.088,1.506,2.871,0,2.871,0L13.412,1.504L0,13.317z" />
          <polygon points="23.273,4.175 20.674,4.175 20.685,7.328 23.273,9.525 		" />
        </g>
        <g id="Capa_1_216_"></g>
      </g>
    </svg>
  );
};

export default Navigator;
