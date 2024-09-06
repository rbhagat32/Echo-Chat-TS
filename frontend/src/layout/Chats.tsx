import { useSelector } from "react-redux";

const Chats = () => {
  const { isSideBarOpen } = useSelector((state: StateTypes) => state.misc);

  return (
    <div
      className={`${
        isSideBarOpen ? "-left-52 lg:-left-80" : "left-0"
      } fixed w-52 lg:w-80 h-full overflow-auto bg-neutral-800 duration-300 ease-in-out z-[99]`}
    >
      <div className="relative top-20">
        {/* chats.map */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-5">
            <p>Chat {i}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
