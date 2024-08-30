import { useState } from "react";
import axios from "../utils/axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Loader from "../partials/Loader";
import { useCheckAuth } from "../hooks/useCheckAuth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<LoginFormData>();

  const { loading, setLoading } = useCheckAuth();

  const login: SubmitHandler<LoginFormData> = (data) => {
    setLoading(true);
    axios
      .post("/auth/login", data)
      .then(() => {
        reset();
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full min-h-screen flex flex-col gap-10 justify-center items-center">
      <h1 className="text-5xl font-black">Login</h1>

      <form onSubmit={handleSubmit(login)} className="w-96 flex flex-col gap-3">
        <input
          {...register("username")}
          type="text"
          placeholder="Username :"
          className="px-4 py-2 rounded-md bg-backgroundLight outline-none border-2 border-white placeholder:text-white"
        />
        <input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="Password :"
          className="relative px-4 py-2 rounded-md bg-backgroundLight outline-none border-2 border-white placeholder:text-white"
        />
        <label>
          <input type="checkbox" onChange={toggleShowPassword} />
          <span className="inline-block ml-2">Show Password</span>
        </label>
        <input
          type="submit"
          value="Login"
          className="shadow-xl font-bold rounded-md py-3 bg-rose-500 hover:bg-rose-600 cursor-pointer text-white"
        />
        <p className="mx-auto">Don't have an account ?</p>
        <Button
          buttonType="link"
          text="Signup"
          to="/signup"
          color="bg-indigo-500"
          hoverColor="hover:bg-indigo-600"
        />
      </form>
    </div>
  );
}
