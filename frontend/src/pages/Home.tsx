import { useGetUserQuery } from "../store/api";

const Home = () => {
  const { isLoading, data } = useGetUserQuery();
  console.log(isLoading, data);

  return (
    <div className="w-screen h-screen flex">
      <div className="h-full w-full md:w-[30%] bg-red-200"></div>
      <div className="h-full w-0 md:w-[70%] bg-blue-200"></div>
    </div>
  );
};

export default Home;
