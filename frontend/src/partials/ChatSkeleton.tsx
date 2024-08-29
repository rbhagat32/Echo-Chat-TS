export default function ChatSkeleton() {
  return (
    <div className="w-full md:w-[40%] lg:w-[30%]">
      <div className="p-5 mt-1">
        <div className="relative px-5 py-7 animate-pulse bg-backgroundLight rounded-full"></div>
      </div>

      <div className="px-5 mt-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-5 bg-backgroundLight/60 px-5 py-4 rounded-lg mb-2 animate-pulse"
          >
            <div className="size-16 rounded-full overflow-hidden">
              <div className="w-full h-full bg-neutral-700/50"></div>
            </div>
            <div className="w-1/2 bg-neutral-700/50 rounded-full h-5"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
