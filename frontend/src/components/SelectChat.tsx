export default function SelectChat() {
  return (
    <div className="w-full h-full grid place-items-center">
      <div className="flex flex-col gap-2 justify-center items-center">
        <img src="/vite.svg" alt="Logo" className="size-36" />
        <h1 className="text-xl font-semibold">
          Send and Receive Real-Time Messages.
        </h1>
        <p className="text-neutral-500">Please select a chat to continue.</p>
      </div>
    </div>
  );
}
