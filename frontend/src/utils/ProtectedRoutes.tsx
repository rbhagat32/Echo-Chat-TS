import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRoutesProps {
  children?: JSX.Element;
  user: boolean;
  redirect: string;
}

const ProtectedRoutes = ({
  children,
  user,
  redirect,
}: ProtectedRoutesProps) => {
  if (!user) return <Navigate to={redirect} />;
  return children ? children : <Outlet />;
};

export default ProtectedRoutes;
