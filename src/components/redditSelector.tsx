"use client";

import { Ref, forwardRef, useEffect, useRef, useState } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { RedditInfo } from "@/types/reddit";

const RedditSelector = () => {
  const [reddits, setReddits] = useState<RedditInfo[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/r")
      .then((res) => res.json())
      .then(({ reddits }) => setReddits(reddits ?? []));
  }, []);

  const onValueChange = (value: string) => {
    router.push(`/r/${value}`);
  };

  return (
    <Select.Root onValueChange={onValueChange}>
      <Select.Trigger
        className="focus:border-gray active:border-gray flex min-w-[3rem] items-center justify-between gap-2 border border-white px-1 py-1 hover:border-gray-200 md:min-w-[10rem] md:max-w-[10rem]"
        aria-label="Community"
      >
        <Select.Value
          className="focus:boder-white bg-red-500"
          placeholder={<SelectPlaceholder />}
        />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="max-h-52 overflow-hidden border bg-white text-xs hover:border-gray-200"
          sideOffset={0}
          position="popper"
        >
          <Select.ScrollUpButton className="flex items-center justify-center">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="">
            <Select.Group>
              <Select.Label className="border-b border-gray-200 bg-gray-100 p-1 text-center text-xxs font-bold">
                YOUR COMMUNITIES
              </Select.Label>
              {reddits.map((r) => (
                <SelectItem redditInfo={r} key={r.redditId} />
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
    { redditInfo }: { redditInfo: RedditInfo },
    forwardedRef: Ref<HTMLDivElement>,
  ) => {
    return (
      <Select.Item
        className="flex items-center justify-start p-1 hover:bg-gray-100"
        value={redditInfo.reddit}
        ref={forwardedRef}
      >
        <div className="flex items-center gap-2">
          <Select.ItemText className="">
            <div className="flex items-center gap-2">
              <Image
                width={20}
                height={20}
                src="/r.svg"
                alt="subreddit option image"
              />
              <h1 className="hidden text-xxs font-bold md:block">
                r/{redditInfo.reddit}
              </h1>
            </div>
          </Select.ItemText>
          <h1 className="block text-xxs font-bold md:hidden">
            r/{redditInfo.reddit}
          </h1>
        </div>
      </Select.Item>
    );
  },
);

const SelectPlaceholder = () => {
  return (
    <div className="flex items-center gap-3">
      <Home />
      <h1 className="hidden text-xxs font-bold md:block">Home</h1>
    </div>
  );
};

export default RedditSelector;

const Home = () => {
  return (
    <svg
      fill="#000000"
      height="20px"
      width="20px"
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
