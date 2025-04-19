import { Toaster } from "sonner";
import PageLoader from "./partials/PageLoader";
import Routing from "./utils/Routing";
import { useCheckLoginQuery } from "./store/api";

export default function App() {
  const { isLoading, data } = useCheckLoginQuery();

  return isLoading ? (
    <PageLoader fullScreen />
  ) : (
    <>
      <Toaster richColors position="top-center" duration={1500} />
      <Routing isLoggedIn={data?.isLoggedIn!} />
    </>
  );
}
