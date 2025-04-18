export default function Welcome() {
  return (
    <div className="flex flex-col gap-2 items-center">
      <img src="/logo-light.svg" alt="Logo" className="size-40" />
      <h1 className="text-3xl font-semibold">
        Echo<span className="text-indigo-400">.</span>
      </h1>
      <p className="text-zinc-500 max-w-[38ch] text-justify">
        "Welcome back! Ready to dive into your conversations? Connect with
        friends, share moments, and enjoy seamless communication all in one
        place."
      </p>
    </div>
  );
}
