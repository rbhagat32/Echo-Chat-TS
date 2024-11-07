import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Button from "../components/Button";
import ButtonAlt from "../components/ButtonAlt";
import Input from "../components/Input";
import Spinner from "../partials/Spinner";
import { api } from "../store/api";
import { setAuth } from "../store/reducers/AuthSlice";
import axios from "../utils/axios";

interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const { handleSubmit, register, reset } = useForm<LoginFormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const login: SubmitHandler<LoginFormData> = (data) => {
    setLoading(true);
    axios
      .post("/auth/login", data)
      .then(() => {
        reset();
        dispatch(setAuth(true));
        dispatch(api.util.invalidateTags(["Auth"]));
        dispatch(api.util.invalidateTags(["Chat"]));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Unable to Sign In !");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-screen h-screen flex">
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.9),rgba(0,0,0,1)), url(/background.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="bg-neutral-800/30 px-10 lg:px-20 xl:px-40 hidden md:flex py-20 w-full h-full justify-between flex-col gap-4"
      >
        <div className="w-fit flex items-center gap-2">
          <img src="/logo-light.svg" alt="Logo" className="size-10" />
          <h1 className="text-3xl font-semibold">Echo.</h1>
        </div>

        <div>
          <h1 className="text-lg text-zinc-500">
            "Welcome back! Ready to dive into your conversations? Connect with
            friends, share moments, and enjoy seamless communication all in one
            place."
          </h1>
        </div>
      </div>

      <div className="relative px-20 lg:px-40 w-full h-full flex justify-center items-center flex-col text-center gap-2">
        <ButtonAlt absolute={true} side="right" route="signup">
          Sign Up
        </ButtonAlt>
        <div>
          <h1 className="font-bold text-2xl mb-1">Login to your account</h1>
          <h2 className="text-lg text-zinc-500">
            Enter your username and password to sign in
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(login)}
          className="w-full flex flex-col gap-3"
        >
          <Input
            register={register("username")}
            type="text"
            placeholder="Username"
          />
          <Input
            register={register("password")}
            type="password"
            placeholder="Password"
          />
          <Button type="submit" width="w-full">
            {!loading ? "Sign In" : <Spinner />}
          </Button>
          <p className="text-zinc-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
