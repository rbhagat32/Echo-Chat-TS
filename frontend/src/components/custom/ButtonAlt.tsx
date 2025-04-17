import { useNavigate } from "react-router-dom";
import { TiArrowLeft } from "react-icons/ti";

interface ButtonAltProps {
  children?: React.ReactNode;
  absolute?: boolean;
  side?: "left" | "right";
  route?: string;
}

const ButtonAlt = ({
  children,
  absolute = false,
  side,
  route,
}: ButtonAltProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/${route}`)}
      className={`${
        absolute &&
        `absolute top-20 ${
          side === "left" ? "left-20 lg:left-40" : "right-20 lg:right-40"
        }`
      } hover:bg-zinc-800 font-semibold px-4 py-2 rounded-lg duration-300 ease-in-out flex items-center`}
    >
      <TiArrowLeft className="text-2xl mt-0.5" />
      <p className="text-lg">{children}</p>
    </button>
  );
};

export default ButtonAlt;
