import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PageLoader from "../partials/PageLoader";
import ProtectedRoutes from "./ProtectedRoutes";
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/SignUp"));
// const MessageContainer = lazy(() => import("../layout/MessageContainer"));
import MessageContainer from "../layout/MessageContainer";
import { SocketProvider } from "../socket";
const NotFound = lazy(() => import("../partials/NotFound"));

const Routing = ({ isLoggedIn = false }: { isLoggedIn: boolean }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          element={
            <SocketProvider>
              <ProtectedRoutes isLoggedIn={isLoggedIn} redirect="/login" />
            </SocketProvider>
          }
        >
          <Route path="/" element={<Home />}>
            <Route path="/chat/:chatId" element={<MessageContainer />} />
          </Route>
        </Route>

        <Route
          element={<ProtectedRoutes isLoggedIn={!isLoggedIn} redirect="/" />}
        >
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default Routing;
