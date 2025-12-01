import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import NotFound from "@/partials/NotFound";
import { Route, Routes } from "react-router-dom";
import { SocketProvider } from "../Socket";
import ProtectedRoutes from "./ProtectedRoutes";

const Routing = ({ isLoggedIn = false }: { isLoggedIn: boolean }) => {
  return (
    <Routes>
      <Route
        element={
          // socket connection is available only when user is logged in
          <SocketProvider>
            {/* protected routes has no children passed here */}
            {/* so it will render Outlet (child routes) */}
            {/* "/" -> Layout component */}
            <ProtectedRoutes isLoggedIn={isLoggedIn} redirect="/login" />
          </SocketProvider>
        }
      >
        <Route path="/" element={<Layout />} />
      </Route>

      <Route
        // path="/auth"
        // if path is given here, then routes will become "/auth/login" and "/auth/signup"

        // protected routes has no children passed here
        // so it will render Outlet (child routes)
        // "/login" -> Login component
        // "/signup" -> SignUp component
        element={<ProtectedRoutes isLoggedIn={!isLoggedIn} redirect="/" />}
      >
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* Alternate way: by passing children (each route has to be wrapped with ProtectedRoutes individually) */}
      {/* <Route
        path="/login"
        element={
          <ProtectedRoutes isLoggedIn={!isLoggedIn} redirect="/">
            <Login />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedRoutes isLoggedIn={!isLoggedIn} redirect="/">
            <SignUp />
          </ProtectedRoutes>
        }
      /> */}

      {/* catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
