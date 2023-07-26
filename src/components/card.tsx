import { FC } from "react";
import Image from "next/image";

type Props = {
  className?: string;
};

const Card: FC<Props> = () => {
  return (
    <div className="h-full w-full overflow-scroll rounded-xl border border-white bg-blue-300 p-5 text-center opacity-80 transition-all hover:opacity-100 dark:bg-stone-900">
      <h1 className="pb-5 text-3xl font-extrabold shadow-sky-100">
        Hola soy la clase god
      </h1>
      <p className="">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla aliquam
        velit vitae elit facilisis ullamcorper sed quis justo. Cras a risus
        vestibulum, cursus metus a, tempor leo. Etiam maximus et libero suscipit
        tempor. Sed mattis turpis mauris, id condimentum nulla maximus at. Nunc
        facilisis, tortor et viverra tempus, mauris odio placerat magna,
        venenatis auctor enim nisl in nisl. Donec pulvinar risus sed varius
        vestibulum.
      </p>
      <div className="mt-4 grid w-full place-items-center">
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          className="duration-400 mt-3 transition-all ease-in-out hover:scale-150 dark:invert"
          width={100}
          height={24}
          priority
        />
      </div>
    </div>
  );
};

export default Card;
