import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PageLoader from "../partials/PageLoader";

const Home = lazy(() => import("../pages/Home"));
const Signup = lazy(() => import("../pages/Signup"));
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../partials/NotFound"));

export default function Routing() {
  const loc = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes location={loc} key={loc.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
