import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminRoutes from "@/routes/AdminRoutes";
import UserRoutes from "@/routes/UserRoutes";
import AuthRoutes from "@/routes/AuthRoutes";
import StaffRoutes from "@/routes/StaffRoutes";
import PageNotFound from "@/pages/PageNotFound";
import ChatBox from "./components/ChatBox/ChatBox";

function App() {

  const router = createBrowserRouter([
    UserRoutes,
    AdminRoutes,
    StaffRoutes,
    ...AuthRoutes,
    { path: "*", element: <PageNotFound /> },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ChatBox />
    </>
  );
}

export default App;

