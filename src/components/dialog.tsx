"use client";
import * as DialogUI from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

export interface modalProps<T> {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  props?: T;
}

interface dialogProps<T> {
  children: ReactNode;
  Modal: FC<modalProps<T>>;
  modalProps?: T;
  modalClassName?: string;
}

export default function Dialog<T>(props: dialogProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <DialogUI.Root open={open} onOpenChange={() => setOpen(!open)}>
      <DialogUI.Trigger className="w-full focus:outline-none">
        {props.children}
      </DialogUI.Trigger>
      <DialogUI.Portal>
        <DialogUI.Overlay className="fixed inset-0 bg-black/70 data-[state=open]:animate-overlayShow" />
        <DialogUI.Content
          className={twMerge(
            "fixed left-1/2 top-1/2 flex w-full max-w-md -translate-x-2/4 -translate-y-2/4 transform flex-col gap-4 rounded bg-white focus:outline-none data-[state=open]:animate-contentShow",
            props.modalClassName,
          )}
        >
          <DialogUI.Close
            asChild
            className="focus:shadown-none focus:border-none focus:outline-none active:outline-none"
          >
            <button
              className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:bg-background/80 focus:shadow-none "
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </DialogUI.Close>
          <props.Modal setOpen={setOpen} props={props.modalProps} />
        </DialogUI.Content>
      </DialogUI.Portal>
    </DialogUI.Root>
  );
}
