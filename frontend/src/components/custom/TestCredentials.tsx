import { Dialog } from "./Dialog";

export const TestCredentialsDialog = ({
  fillCredentials,
}: {
  fillCredentials: (username: string, password: string) => void;
}) => {
  const accountsData = [
    {
      title: "😎",
      username: "raghav",
      password: "Raghav@123",
    },
    {
      title: "☺️",
      username: "test",
      password: "Test@123",
    },
    {
      title: "😁",
      username: "test2",
      password: "Test@123",
    },
  ];

  return (
    <Dialog
      component={
        <div className="flex flex-col gap-4">
          <div className="mb-1 text-center">
            <h1 className="text-center text-lg font-semibold">I value your time.</h1>
            <p className="text-zinc-500">So, here are some accounts to try out this app.</p>
          </div>

          <div className="flex justify-evenly">
            {accountsData.map((account, index) => (
              <button
                key={index}
                onClick={() => fillCredentials(account.username, account.password)}
                className="flex cursor-pointer items-center gap-2 rounded-full border bg-zinc-800 p-2 transition duration-300 hover:bg-zinc-800/30"
              >
                <span className="text-3xl">{account.title}</span>
              </button>
            ))}
          </div>

          <div className="text-center text-sm">Enjoy !</div>
        </div>
      }
    >
      <div className="mx-auto mt-2 flex w-fit cursor-pointer items-center rounded-lg border-2 px-4 py-2 font-semibold duration-300 ease-in-out hover:ring-2 hover:ring-indigo-400">
        <p className="text-sm">Secret shhhhh.....🤫</p>
      </div>
    </Dialog>
  );
};
