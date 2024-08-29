export default function TopBar({ user }: { user: UserTypes }) {
  return (
    <div className="p-5 flex gap-4 items-center border-b border-neutral-700">
      <div className="size-12 rounded-full overflow-hidden">
        <img src={user.avatar.url} alt="LoggedIn User Avatar" />
      </div>
      <h1 className="text-xl">{user.username}</h1>
    </div>
  );
}
