interface ButtonProps {
  children?: React.ReactNode;
  type?: "button" | "submit";
  width?: string;
  color?: string;
}

const Button = ({
  children,
  type = "button",
  width = "w-fit",
  color = "bg-indigo-500",
}: ButtonProps) => {
  return (
    <button type={type} className={`${width} ${color} rounded-lg px-4 py-3 text-lg font-semibold`}>
      {children}
    </button>
  );
};

export default Button;
