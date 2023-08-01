"use client";

import { FC } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon, VideoIcon } from "@radix-ui/react-icons";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="grid h-screen w-screen place-items-center bg-background text-white">
      <DropdownMenuDemo />
    </div>
  );
};

const DropdownMenuDemo = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded bg-blue-500 shadow-xl shadow-slate-200 outline-none focus:border-blue-200"
          aria-label="Customise options"
        >
          <HamburgerMenuIcon className="h-full w-full p-[6px]" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          className="rounded-md bg-white p-1 data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
        >
          <DropdownMenu.Label className="ml-1.5 opacity-50">
            Editor
          </DropdownMenu.Label>
          <MenuItem>
            vim
            <VideoIcon />
          </MenuItem>
          <MenuItem>
            emacs
            <VideoIcon />
          </MenuItem>

          <DropdownMenu.Separator className="my-2 h-[2px] bg-slate-200" />

          <DropdownMenu.Label className="ml-1.5 opacity-50">
            Color
          </DropdownMenu.Label>
          <MenuItem>
            vim
            <VideoIcon />
          </MenuItem>
          <MenuItem>
            emacs
            <VideoIcon />
          </MenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const MenuItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <DropdownMenu.Item className="full m-1 flex max-h-fit min-w-[10em] flex-row items-center justify-between gap-5 rounded px-2 py-1 outline-none focus:bg-slate-800 focus:text-white">
      {children}
    </DropdownMenu.Item>
  );
};

export default page;

//
// import React from 'react';
// import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// import {
//   HamburgerMenuIcon,
//   DotFilledIcon,
//   CheckIcon,
//   ChevronRightIcon,
// } from '@radix-ui/react-icons';
//
// const DropdownMenuDemo = () => {
//   const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
//   const [urlsChecked, setUrlsChecked] = React.useState(false);
//   const [person, setPerson] = React.useState('pedro');
//
//   return (
//     <DropdownMenu.Root>
//       <DropdownMenu.Trigger asChild>
//         <button
//           className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-violet11 bg-white shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black"
//           aria-label="Customise options"
//         >
//           <HamburgerMenuIcon />
//         </button>
//       </DropdownMenu.Trigger>
//
//       <DropdownMenu.Portal>
//         <DropdownMenu.Content
//           className="min-w-[220px] bg-white rounded-md p-[5px] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
//           sideOffset={5}
//         >
//           <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
//             New Tab{' '}
//             <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
//               ⌘+T
//             </div>
//           </DropdownMenu.Item>
//           <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
//             New Window{' '}
//             <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
//               ⌘+N
//             </div>
//           </DropdownMenu.Item>
//           <DropdownMenu.Item
//             className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
//             disabled
//           >
//             New Private Window{' '}
//             <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
//               ⇧+⌘+N
//             </div>
//           </DropdownMenu.Item>
//           <DropdownMenu.Sub>
//             <DropdownMenu.SubTrigger className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[state=open]:bg-violet4 data-[state=open]:text-violet11 data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 data-[highlighted]:data-[state=open]:bg-violet9 data-[highlighted]:data-[state=open]:text-violet1">
//               More Tools
//               <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
//                 <ChevronRightIcon />
//               </div>
//             </DropdownMenu.SubTrigger>
//             <DropdownMenu.Portal>
//               <DropdownMenu.SubContent
//                 className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
//                 sideOffset={2}
//                 alignOffset={-5}
//               >
//                 <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
//                   Save Page As…{' '}
//                   <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
//                     ⌘+S
//                   </div>
//                 </DropdownMenu.Item>
//                 <DropdownMenu.Item className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
//                   Create Shortcut…
//                 </DropdownMenu.Item>
//                 <DropdownMenu.Item className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
//                   Name Window…
//                 </DropdownMenu.Item>
//                 <DropdownMenu.Separator className="h-[1px] bg-violet6 m-[5px]" />
//                 <DropdownMenu.Item className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
//                   Developer Tools
//                 </DropdownMenu.Item>
//               </DropdownMenu.SubContent>
//             </DropdownMenu.Portal>
//           </DropdownMenu.Sub>
//
//           <DropdownMenu.Separator className="h-[1px] bg-violet6 m-[5px]" />
//
//           <DropdownMenu.CheckboxItem
//             className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
//             checked={bookmarksChecked}
//             onCheckedChange={setBookmarksChecked}
//           >
//             <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
//               <CheckIcon />
//             </DropdownMenu.ItemIndicator>
//             Show Bookmarks{' '}
//             <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
//               ⌘+B
//             </div>
//           </DropdownMenu.CheckboxItem>
//           <DropdownMenu.CheckboxItem
//             className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
//             checked={urlsChecked}
//             onCheckedChange={setUrlsChecked}
//           >
//             <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
//               <CheckIcon />
//             </DropdownMenu.ItemIndicator>
//             Show Full URLs
//           </DropdownMenu.CheckboxItem>
//
//           <DropdownMenu.Separator className="h-[1px] bg-violet6 m-[5px]" />
//
//           <DropdownMenu.Label className="pl-[25px] text-xs leading-[25px] text-mauve11">
//             People
//           </DropdownMenu.Label>
//           <DropdownMenu.RadioGroup value={person} onValueChange={setPerson}>
//             <DropdownMenu.RadioItem
//               className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
//               value="pedro"
//             >
//               <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
//                 <DotFilledIcon />
//               </DropdownMenu.ItemIndicator>
//               Pedro Duarte
//             </DropdownMenu.RadioItem>
//             <DropdownMenu.RadioItem
//               className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
//               value="colm"
//             >
//               <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
//                 <DotFilledIcon />
//               </DropdownMenu.ItemIndicator>
//               Colm Tuite
//             </DropdownMenu.RadioItem>
//           </DropdownMenu.RadioGroup>
//
//           <DropdownMenu.Arrow className="fill-white" />
//         </DropdownMenu.Content>
//       </DropdownMenu.Portal>
//     </DropdownMenu.Root>
//   );
// };
