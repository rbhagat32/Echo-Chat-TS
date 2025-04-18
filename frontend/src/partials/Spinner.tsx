interface SpinnerProps {
  size?: string;
  border?: string;
}

const Spinner = ({ size = "size-7", border = "border-3" }: SpinnerProps) => {
  return (
    <div
      className={`mx-auto ${size} rounded-full ${border} border-t-white animate-spin`}
    ></div>
  );
};

export default Spinner;
