import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import PageLoader from "./partials/PageLoader";
import { useCheckLoginQuery } from "./store/api";
import Routing from "./utils/Routing";

export default function App() {
  // dont use isLoggedIn from api as it might take time refetch Auth tag after login in case of slow internet
  // in that case after login, useNavigate will route to "/"
  // but the Auth tag is still being refetched and the user will be redirected to "/login" again due to ProtectedRoute
  const { isLoading } = useCheckLoginQuery();

  // so take auth status from redux store
  const isLoggedIn = useSelector((state: StateTypes) => state.auth);

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
      <Routing isLoggedIn={isLoggedIn} />
    </>
  );
}
