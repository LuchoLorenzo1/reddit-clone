"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useState } from "react";

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

  return (
    <button
      className="rounded-md p-1 text-center shadow transition-all duration-75 hover:bg-gray-100"
      onClick={() => toggleDarkMode()}
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
