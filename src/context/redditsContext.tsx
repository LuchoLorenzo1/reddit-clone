"use client";
import { RedditInfo } from "@/types/reddit";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type RedditsContextType = {
  reddits: RedditInfo[];
  setReddits: Dispatch<SetStateAction<RedditInfo[]>>;
};

const RedditsContext = createContext<RedditsContextType>({
  reddits: [],
  setReddits: () => {},
});

export const useReddits = () => {
  const context = useContext(RedditsContext);
  if (!context) throw new Error("Trying to use context outside of provider");
  return context;
};

export const RedditsProvider = ({ children }: { children: ReactNode }) => {
  const [reddits, setReddits] = useState<RedditInfo[]>([]);

  useEffect(() => {
    fetch("/api/r")
      .then((res) => res.json())
      .then(({ reddits }) => setReddits(reddits ?? []));
  }, []);

  useEffect(() => {
    console.log("CAMBIO EN REDDITS", reddits);
  }, [reddits]);

  return (
    <RedditsContext.Provider value={{ reddits, setReddits }}>
      {children}
    </RedditsContext.Provider>
  );
};
