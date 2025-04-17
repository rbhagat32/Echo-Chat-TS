interface SpinnerProps {
  size?: string;
  border?: string;
}

const Spinner = ({ size = "size-7", border = "border-2" }: SpinnerProps) => {
  return (
    <div
      className={`mx-auto ${size} rounded-full ${border} border-t-neutral-800 animate-spin`}
    ></div>
  );
};

export default Spinner;
