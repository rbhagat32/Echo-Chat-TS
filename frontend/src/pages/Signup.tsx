import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Loader from "../partials/Loader";
import VisuallyHiddenInput from "../components/VisuallyHiddenInput";
import { useCheckAuth } from "../hooks/useCheckAuth";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedAvatar, setUploadedAvatar] = useState("/user-placeholder.png");
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<SignupFormData>();

  const { loading, setLoading } = useCheckAuth();

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
    <div className="w-full min-h-screen flex flex-col gap-5 justify-center items-center">
      <h1 className="text-5xl font-black">SignUp</h1>

      <form
        onSubmit={handleSubmit(signup)}
        className="w-96 flex flex-col gap-3"
      >
        <div className="relative rounded-full border-2 border-white mx-auto">
          <div className="size-40 rounded-full overflow-hidden">
            <img
              src={uploadedAvatar}
              alt="Selected Image"
              className="w-full h-full object-cover"
            />
          </div>
          <VisuallyHiddenInput
            register={register("avatar")}
            setterFunc={setUploadedAvatar}
          />
        </div>
        <input
          {...register("username")}
          type="text"
          placeholder="Username :"
          className="px-4 py-2 rounded-md bg-backgroundLight border-2 border-white placeholder:text-white"
        />
        <textarea
          {...register("bio")}
          placeholder="Bio :"
          className="min-h-32 max-h-32 px-4 py-2 rounded-md bg-backgroundLight border-2 border-white placeholder:text-white"
        ></textarea>
        <input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="Password :"
          className="px-4 py-2 rounded-md bg-backgroundLight border-2 border-white placeholder:text-white"
        />
        <label className="w-fit">
          <input
            type="checkbox"
            onChange={toggleShowPassword}
            className="cursor-pointer"
          />
          <span className="inline-block ml-2">Show Password</span>
        </label>
        <input
          type="submit"
          value="Sign Up"
          className="border-2 border-black shadow-xl text-xl font-bold rounded-md py-3 bg-rose-500 hover:bg-rose-600 cursor-pointer text-white"
        />
        <p className="mx-auto">Already have an account ?</p>
        <Button
          buttonType="link"
          text="Login"
          to="/login"
          color="bg-indigo-500"
          hoverColor="hover:bg-indigo-600"
        />
      </form>
    </div>
  );
}
