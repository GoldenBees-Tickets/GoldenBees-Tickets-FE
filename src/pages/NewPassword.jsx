import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoHeader from "@/public/LogoHeader.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { useNewPassMutation } from "@/api/authApi";
import { toast } from "react-toastify";

export default function NewPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPass] = useNewPassMutation();

  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password.trim() === "") {
      setErrorPassword("Password is require!");
    }

    setIsLoading(true);
    try {
      const response = await newPass({ token, password, email });

      if (response.data.status === 401) {
        setErrorEmail("Không tìm thấy tài khoản nào!");
      } else {
        toast.success("Cập nhật thành công, vui lòng đăng nhập");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 font-[sans-serif]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="w-16 h-16 border-4 border-t-orange-600 border-gray-300 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="min-h-screen flex flex-col items-center py-6 px-4">
        <div className="max-w-md w-full">
          <Link to="/">
            <img src={logoHeader} alt="logo" className="w-40 mx-auto block" />
          </Link>
          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
              Reset Password
            </h2>
            <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
              <div>
                <label className="text-gray-800 text-sm block mb-2">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-100"
                  />
                  {showPassword ? (
                    <FaEye
                      onClick={() => setShowPassword(false)}
                      className="w-[16px] text-gray-400 absolute right-2 cursor-pointer"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => setShowPassword(true)}
                      className="w-[16px] text-gray-400 absolute right-2 cursor-pointer"
                    />
                  )}
                </div>
                <small className="text-red-500">{errorPassword}</small>
              </div>
              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
