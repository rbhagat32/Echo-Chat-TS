const SelectChat = () => {
  return (
    <div style={{ height: "calc(100vh - 80px)" }} className="relative top-20">
      <div className="relative top-40 flex flex-col gap-2 items-center">
        <img src="/logo-light.svg" alt="Logo" className="size-40" />
        <h1 className="text-3xl font-semibold">Echo.</h1>
        <p className="text-zinc-500 max-w-[38ch] text-justify">
          "Welcome back! Ready to dive into your conversations? Connect with
          friends, share moments, and enjoy seamless communication all in one
          place."
        </p>
      </div>
    </div>
  );
};

export default SelectChat;
