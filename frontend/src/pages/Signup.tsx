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

interface SignupFormData {
  username: string;
  bio: string;
  password: string;
  avatar: FileList;
}

const SignUp = () => {
  const { handleSubmit, register, reset } = useForm<SignupFormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const signup: SubmitHandler<SignupFormData> = (data) => {
    setLoading(true);
    axios
      .post(
        "/auth/signup",
        { ...data, avatar: data.avatar[0] },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        reset();
        toast.success(res?.data?.message);
        dispatch(setAuth(true));
        dispatch(api.util.invalidateTags(["Auth"]));
        dispatch(api.util.invalidateTags(["Chat"]));
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Unable to Sign Up !");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-screen h-screen flex">
      <div className="relative px-20 lg:px-40 w-full h-full flex justify-center items-center flex-col text-center gap-2">
        <ButtonAlt absolute={true} side="left" route="login">
          Sign In
        </ButtonAlt>
        <div>
          <h1 className="font-bold text-2xl mb-1">Signup to a new account</h1>
          <h2 className="text-lg text-zinc-500">
            Enter your details to create a new account
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(signup)}
          className="w-full flex flex-col gap-3"
        >
          <Input
            register={register("username")}
            type="text"
            placeholder="Username"
          />
          <textarea
            {...register("bio")}
            placeholder="Bio"
            className="resize-none min-h-28 px-4 py-3 rounded-lg bg-zinc-800 text-white outline-none focus:ring focus:border-indigo-500 placeholder:text-white placeholder:font-semibold"
          ></textarea>
          <Input
            register={register("password")}
            type="password"
            placeholder="Password"
          />
          <input
            {...register("avatar")}
            multiple={false}
            type="file"
            accept="image/*"
            className="text-zinc-500 rounded-lg cursor-pointer"
          />
          <Button type="submit" width="w-full">
            {!loading ? "Sign Up" : <Spinner />}
          </Button>
          <p className="text-zinc-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>

      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.9),rgba(0,0,0,1)), url(/background.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="bg-neutral-800/30 px-10 lg:px-20 xl:px-40 hidden md:flex py-20 w-full h-full justify-between items-end flex-col gap-4"
      >
        <div className="w-fit flex items-center gap-2 text-right">
          <img src="/logo-light.svg" alt="Logo" className="size-10" />
          <h1 className="text-3xl font-semibold">Echo.</h1>
        </div>

        <div className="text-right">
          <h1 className="text-lg text-zinc-500">
            "Welcome back! Ready to dive into your conversations? Connect with
            friends, share moments, and enjoy seamless communication all in one
            place."
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
