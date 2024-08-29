import { Link } from "react-router-dom";

interface ButtonProps {
  buttonType: "button" | "link";
  text: string;
  color?: string;
  hoverColor?: string;
  to?: string;
  onClick?: () => void;
}

export default function Button({
  buttonType,
  text,
  color = "bg-rose-500",
  hoverColor = "hover:bg-rose-600",
  to,
  onClick,
}: ButtonProps) {
  if (buttonType === "button") {
    return (
      <button
        onClick={onClick}
        className={`border-2 border-black shadow-xl w-fit text-xl font-bold rounded-md px-5 py-2 pb-2.5 ${color} ${hoverColor} cursor-pointer text-white duration-300 ease-in-out`}
      >
        {text}
      </button>
    );
  } else if (buttonType === "link") {
    return (
      <Link
        to={to as string}
        className={`border-2 border-black shadow-xl text-center text-xl font-bold rounded-md py-3 ${color} ${hoverColor} cursor-pointer text-white duration-300 ease-in-out`}
      >
        {text}
      </Link>
    );
  } else {
    return null;
  }
}
