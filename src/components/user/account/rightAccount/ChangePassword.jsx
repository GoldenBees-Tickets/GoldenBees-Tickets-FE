import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUpdateUserMutation } from "@/api/userApi";
import { toast } from "react-toastify";
import { useResetPassMutation } from "@/api/authApi";

function PasswordInput({ label, value, setValue, show, setShow, error, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative flex items-center">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-100"
        />
        {show ? (
          <FaEye className="absolute right-2 text-gray-400 cursor-pointer" onClick={() => setShow(false)} />
        ) : (
          <FaEyeSlash className="absolute right-2 text-gray-400 cursor-pointer" onClick={() => setShow(true)} />
        )}
      </div>
      {error && <small className="text-red-500">{error}</small>}
    </div>
  );
}

export default function ChangePassword({ setToggleUpdatePassword, userid }) {
  const [updatePassword] = useUpdateUserMutation();
  const [resetPassword] = useResetPassMutation();
  
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorPassword, setErrorPassword] = useState("");
  const [errorNewPassword, setErrorNewPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorPassword("");
    setErrorNewPassword("");
    setErrorConfirmPassword("");

    if (newPassword !== confirmPassword) {
      setErrorConfirmPassword("Mật khẩu xác nhận không trùng khớp");
      return;
    }

    const response = await updatePassword({ password, newPassword, id: userid });
    console.log("response", response);
    
    if (response?.data?.user.status === 401) {
      setErrorPassword(response?.data?.user?.message || "Có lỗi xảy ra");
    } else {
      toast.success("Cập nhật mật khẩu thành công");
      setToggleUpdatePassword(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return toast.error("Vui lòng nhập email để nhận link đặt lại mật khẩu");
    console.log("email", email);
    setShowForgotPassword(false);
    setToggleUpdatePassword(false);
    toast.info("Đã gửi link đặt lại mật khẩu tới email của bạn");
    await resetPassword(email);
  };

  return (
    <form onSubmit={handleUpdatePassword} className="bg-white rounded-lg shadow-lg p-6 w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Thay đổi mật khẩu</h2>
        <IoMdCloseCircleOutline
          className="text-gray-400 cursor-pointer hover:text-gray-800 transition duration-200"
          size={24}
          onClick={() => setToggleUpdatePassword(false)}
        />
      </div>
      {!showForgotPassword ? (
        <>
          <PasswordInput label="Mật khẩu hiện tại" value={password} setValue={setPassword} show={showPassword} setShow={setShowPassword} error={errorPassword} placeholder="Nhập mật khẩu hiện tại" />
          <PasswordInput label="Mật khẩu mới" value={newPassword} setValue={setNewPassword} show={showNewPassword} setShow={setShowNewPassword} error={errorNewPassword} placeholder="Nhập mật khẩu mới" />
          <PasswordInput label="Xác nhận mật khẩu mới" value={confirmPassword} setValue={setConfirmPassword} show={showConfirmPassword} setShow={setShowConfirmPassword} error={errorConfirmPassword} placeholder="Xác nhận mật khẩu mới" />
          <button type="submit" className="w-full bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600 transition duration-200">Cập nhật</button>
          <p className="text-center text-sm text-gray-500 mt-2 cursor-pointer" onClick={() => setShowForgotPassword(true)}>Quên mật khẩu?</p>
        </>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nhập email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email để nhận link đặt lại mật khẩu"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-100"
            />
          </div>
          <button type="button" onClick={handleForgotPassword} className="w-full bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600 transition duration-200">Gửi link đặt lại mật khẩu</button>
          <p className="text-center text-sm text-gray-500 mt-2 cursor-pointer" onClick={() => setShowForgotPassword(false)}>Quay lại</p>
        </>
      )}
    </form>
  );
}