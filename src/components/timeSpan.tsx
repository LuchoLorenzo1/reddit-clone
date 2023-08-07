"use client";

import { useEffect, useState } from "react";

export const TimeSpan = ({ date }: { date: Date }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(date.toLocaleString());
  }, [date]);

  return (
    <div className="absolute bottom-6 hidden bg-black p-1 text-xs text-white opacity-90 group-hover:block">
      <h1>{time}</h1>
    </div>
  );
};
