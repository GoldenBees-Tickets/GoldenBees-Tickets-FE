import { Navigate } from "react-router-dom";
import RootStaff from "@/layouts/root/RootStaff";
import ScanQrCodePage from "@/pages/staff/ScanQrCodePage";

// Đây là một ví dụ đơn giản về middleware bảo vệ route cho nhân viên
// Thực tế sẽ cần kiểm tra token, vai trò, v.v.
const isStaff = () => {
  // Kiểm tra xem người dùng có phải là nhân viên hay không
  // Thực tế cần kiểm tra JWT token hoặc session
  return true; // Giả sử luôn đúng để test
};

const StaffGuard = ({ children }) => {
  if (!isStaff()) {
    // Chuyển hướng về trang đăng nhập nếu không phải nhân viên
    return <Navigate to="/login" replace />;
  }
  return children;
};

const StaffRoutes = {
  path: "/staff",
  element: (
    <StaffGuard>
      <RootStaff />
    </StaffGuard>
  ),
  children: [
    { path: "", element: <Navigate to="scan-qr" replace /> },
    { path: "scan-qr", element: <ScanQrCodePage /> },
    // Thêm các route khác cho nhân viên ở đây nếu cần
  ],
};

export default StaffRoutes; 