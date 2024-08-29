export default function Loader({ height = "h-screen" }: { height?: string }) {
  return (
    <div className={`w-full ${height} grid place-items-center`}>
      <div
        className={`size-14 rounded-full border-8 border-zinc-300 border-t-indigo-500 animate-spin`}
      ></div>
    </div>
  );
}
