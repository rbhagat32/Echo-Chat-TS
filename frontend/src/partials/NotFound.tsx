import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <img src="/404.svg" alt="404 Image" />
      <h1 className="text-4xl font-semibold text-indigo-500 mb-3">
        Page Not Found 😵
      </h1>
      <Link
        to="/"
        className="text-lg text-zinc-400 hover:text-zinc-800 duration-200 ease-in-out"
      >
        Go back to Home
      </Link>
    </div>
  );
}
