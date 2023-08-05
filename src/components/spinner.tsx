import { twMerge } from "tailwind-merge";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        "inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-zinc-900 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:border-zinc-200 dark:border-r-transparent",
        className,
      )}
    />
  );
};

export default Spinner;
