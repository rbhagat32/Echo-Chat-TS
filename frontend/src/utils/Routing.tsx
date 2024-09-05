import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PageLoader from "../partials/PageLoader";
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/SignUp"));
const Chat = lazy(() => import("../pages/Chat"));

const Routing = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Suspense>
  );
};

export default Routing;
