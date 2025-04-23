import { Toaster } from "sonner";
import PageLoader from "./partials/PageLoader";
import Routing from "./utils/Routing";
import { useCheckLoginQuery } from "./store/api";
import { useEffect } from "react";

export default function App() {
  const { isLoading, data } = useCheckLoginQuery();

  // prevent browser's right click menu
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }, []);

  return isLoading ? (
    <PageLoader fullScreen={true} />
  ) : (
    <>
      <Toaster richColors position="top-center" duration={5000} />
      <Routing isLoggedIn={data?.isLoggedIn!} />
    </>
  );
}
