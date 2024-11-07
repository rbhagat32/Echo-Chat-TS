const SearchBox = () => {
  return (
    <input
      className="outline-none border-2 border-white focus:border-indigo-400 rounded-full text-white placeholder:text-white bg-transparent py-2 px-5 w-60 md:w-80 lg:w-96 duration-300 ease-in-out"
      type="text"
      placeholder="Search User"
    />
  );
};

export default SearchBox;
