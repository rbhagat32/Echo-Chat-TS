import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { SocketProvider } from "../Socket";
import ProtectedRoutes from "./ProtectedRoutes";
import PageLoader from "@/partials/PageLoader";
import NotFound from "@/partials/NotFound";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Layout from "@/layout/Layout";

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
          <Route path="/" element={<Layout />}></Route>
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
