"use client";
import Reddit from "@/types/reddit";
import { ReactNode, createContext, useContext } from "react";

const RedditDataContext = createContext<Reddit | null>(null);

export const useRedditData = () => {
  return useContext(RedditDataContext);
};

export const RedditDataProvider = ({
  children,
  redditData,
}: {
  children: ReactNode;
  redditData: Reddit;
}) => {
  return (
    <RedditDataContext.Provider value={redditData}>
      {children}
    </RedditDataContext.Provider>
  );
};
