import { Toaster } from "sonner";
import PageLoader from "./partials/PageLoader";
import { useCheckLoginQuery } from "./store/api";
import Routing from "./utils/Routing";

const App = () => {
  const { isLoading, data } = useCheckLoginQuery();

  return isLoading ? (
    <PageLoader />
  ) : (
    <>
      <Toaster richColors position="top-center" duration={1500} />
      <Routing isLoggedIn={data?.isLoggedIn!} />
    </>
  );
};

export default App;
