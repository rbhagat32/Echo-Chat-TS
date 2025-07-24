import { useNavigate } from "react-router-dom";

interface ButtonAltProps {
  children?: React.ReactNode;
  absolute?: boolean;
  side?: "left" | "right";
  route?: string;
}

const CustomLink = ({
  children,
  absolute = false,
  side,
  route,
}: ButtonAltProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/${route}`)}
      className={`ring hover:ring-2 hover:ring-indigo-400 ${
        absolute &&
        `absolute top-20 ${
          side === "left" ? "left-20 lg:left-40" : "right-20 lg:right-40"
        }`
      } font-semibold px-4 py-2 rounded-lg duration-300 ease-in-out flex items-center`}
    >
      <p className="text-sm">{children}</p>
    </button>
  );
};

export default CustomLink;
