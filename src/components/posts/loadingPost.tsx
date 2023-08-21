const LoadingPost = () => (
  <div className="flex max-w-full rounded-sm">
    <div className="w-8 rounded-l-sm bg-background-300 px-1 py-2" />

    <div className="relative w-full max-w-full rounded-r-sm bg-background-100 px-2 pb-1 hover:text-opacity-100">
      <div className="flex w-full max-w-full animate-pulse items-center gap-2 pt-1 delay-150 sm:gap-2">
        <div className="h-6 w-6 rounded-full bg-background-300" />
        <div className="h-4 w-12 rounded-md bg-background-300" />
        <div className="h-4 w-12 rounded-md bg-background-300" />
      </div>

      <div className="flex h-24 w-full animate-pulse flex-col gap-2 px-1 py-3">
        <div className="h-8 w-1/3 rounded-md bg-text/30" />
        <div className="h-8 w-5/6 rounded-md bg-text/30" />
        <div className="h-8 w-4/6 rounded-md bg-text/30" />
        <div className="flex">
          <div className="h-1/6 w-1/3 animate-pulse rounded-md bg-text/30" />
        </div>
      </div>

      <div className="align-center flex animate-pulse gap-2 text-gray-500">
        <div className="h-6 w-24 rounded-md bg-background-300" />
        <div className="h-6 w-16 rounded-md bg-background-300" />
        <div className="h-6 w-16 rounded-md bg-background-300 " />
      </div>
    </div>
  </div>
);

export default LoadingPost;
