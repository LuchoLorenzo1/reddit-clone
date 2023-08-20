"use client";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { RedditInfo } from "@/types/reddit";
import { twMerge } from "tailwind-merge";
import * as Dialog from "@radix-ui/react-dialog";

interface searchBarProps {}

const SearchBar: FC<searchBarProps> = ({}) => {
  const [results, setResults] = useState<RedditInfo[]>([]);
  const [open, setOpen] = useState(false);
  const { debounceQuery, query, setQuery } = useDebouncedQuery();
  const firstQuery = useRef(true);

  useEffect(() => {
    if (firstQuery.current) {
      firstQuery.current = false;
      return;
    }

    if (!query.trim()) return setResults([]);

    fetch(`/api/search?query=${query}`)
      .then((res) => res.json())
      .then(({ reddits }) => {
        setResults([...reddits]);
      });
  }, [debounceQuery]);

  const onInputChange = (e: any) => {
    setOpen(true);
    setQuery(e.target.value);
  };

  return (
    <div
      id="searchBarContainer"
      className={twMerge(
        "relative box-content flex w-full max-w-md flex-row items-center gap-1 border-2 border-transparent bg-background-100 px-2 py-1 hover:border-text",
        open && query != "" ? "rounded-t-2xl border-text" : "rounded-full",
      )}
    >
      <Dialog.Root
        modal={false}
        open={open}
        onOpenChange={(o) => setOpen(o)}
        defaultOpen={false}
      >
        <MagnifyingGlassIcon
          width={30}
          height={30}
          className="pl-1 opacity-50"
        />
        <input
          onChange={onInputChange}
          type="text"
          className="left-5 w-full rounded-full bg-transparent px-2 text-xs outline-none"
          placeholder="Search Reddit"
        />
        <Dialog.Portal
          container={document.getElementById("searchBarContainer")}
        >
          <Dialog.Content onOpenAutoFocus={(e) => e.preventDefault()}>
            {open && query != "" ? (
              <div className="h-30 absolute right-1/2 top-full z-50 mt-[2px] w-full translate-x-1/2 border-2 border-background bg-background-100 text-sm">
                {firstQuery.current ? (
                  ""
                ) : (
                  <RedditResults setOpen={setOpen} results={results} />
                )}
              </div>
            ) : (
              ""
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

const RedditResults = ({
  results,
  setOpen,
}: {
  results: RedditInfo[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  if (results.length <= 0) return <h3 className="p-2 text-xs">No results</h3>;

  return (
    <>
      <h3 className="px-2 text-xxs">Communities</h3>
      {results.map((r) => (
        <Link
          onClick={() => setOpen(false)}
          key={r.redditId}
          href={`/r/${r.reddit}`}
          className="flex items-center gap-2 px-2 py-2"
        >
          <Image
            src={
              r.imageId
                ? `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${r.imageId}`
                : "/r.svg"
            }
            className="rounded-full bg-white"
            width={20}
            height={20}
            alt="Result reddit icon"
          />
          <h4 className="overflow-hidden overflow-ellipsis text-xs">
            r/{r.reddit}
          </h4>
        </Link>
      ))}
    </>
  );
};

const useDebouncedQuery = () => {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const currQuery = useRef("");

  useEffect(() => {
    currQuery.current = query;
    setTimeout(() => {
      if (currQuery.current == query) {
        setDebounceQuery(query);
      }
    }, 500);
  }, [query]);

  return { debounceQuery, query, setQuery };
};

export default SearchBar;
