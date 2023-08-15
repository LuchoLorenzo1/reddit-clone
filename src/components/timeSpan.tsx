"use client";

import { useEffect, useState } from "react";

export const TimeSpan = ({ date }: { date: Date | string }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    if (typeof date == "string") {
      setTime(new Date(date).toLocaleString());
    } else {
      setTime(date.toLocaleString());
    }
  }, [date]);

  return (
    <div className="absolute bottom-6 hidden -translate-x-1/2 bg-black p-1 text-xs text-white opacity-90 group-hover:inline-block sm:left-1/2">
      <h1 className="whitespace-nowrap">{time}</h1>
    </div>
  );
};
