import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import ResetPassword from "@/components/auth/ResetPassword";
import NewPassword from "@/components/auth/NewPassword";
import ForbiddenPage from "@/components/ForbiddenPage";
import ActiveAccount from "@/components/auth/ActiveAccount";

const AuthRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/resetPass", element: <ResetPassword /> },
  { path: "/reset-password", element: <NewPassword /> },
  { path: "/active-account", element: <ActiveAccount /> },
  { path: "/permission-denied-page", element: <ForbiddenPage />}
];

export default AuthRoutes;
