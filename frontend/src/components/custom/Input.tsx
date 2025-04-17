import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
}

const Input = ({ type, placeholder, register }: InputProps) => {
  return (
    <input
      {...register}
      type={type}
      placeholder={placeholder}
      className="px-4 py-3 rounded-lg bg-zinc-800 text-white outline-none focus:ring focus:border-indigo-500 placeholder:text-white placeholder:font-semibold"
    />
  );
};

export default Input;
