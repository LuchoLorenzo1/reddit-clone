"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const ToggleDarkMode = () => {
  const [dark, setDark] = useState(false);

  const toggleDarkMode = () => {
    if (localStorage.theme && localStorage.theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  useEffect(() => {
    if (localStorage.theme && localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  return (
    <button
      className="rounded-md p-1 text-center shadow-sm shadow-background transition-all duration-75 hover:bg-background/60"
      onClick={toggleDarkMode}
    >
      {dark ? (
        <SunIcon width={30} height={30} />
      ) : (
        <MoonIcon width={30} height={30} />
      )}
    </button>
  );
};

export default ToggleDarkMode;
