import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "@/utils/auth"; 

const PrivateAdminRoute = ({ element, requiredRole }) => {
  const role = getUserRole();
  
  if (!isAuthenticated()) {    
    return <Navigate to="/login" replace />;
  }

  if (!requiredRole.includes(role)) {
    return <Navigate to="/permission-denied-page" replace />;
  }

  return element;
};

export default PrivateAdminRoute;
