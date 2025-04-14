import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useUpdateUserMutation } from "@/api/userApi";
import { toast } from "react-toastify";
import { useResetPassMutation } from "@/api/authApi";
import { useForm } from "react-hook-form";
import { validateEmail } from "@/utils/auth";

function PasswordInput({ label, register, name, validation, showPassword, setShowPassword, error, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative flex items-center">
        <input
          type={showPassword ? "text" : "password"}
          {...register(name, validation)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-100"
        />
        {showPassword ? (
          <FaEye className="absolute right-2 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} />
        ) : (
          <FaEyeSlash className="absolute right-2 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
        )}
      </div>
      {error && <small className="text-red-500 text-xs block h-5">{error}</small>}
    </div>
  );
}

export default function ChangePassword({ setToggleUpdatePassword, userid }) {
  const [updatePassword] = useUpdateUserMutation();
  const [resetPassword] = useResetPassMutation();
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form cho đổi mật khẩu
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    formState: { errors: passwordErrors },
    trigger: triggerPassword,
  } = useForm({
    mode: "all",
    criteriaMode: "all",
  });

  // Form cho quên mật khẩu
  const {
    register: resetRegister,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    trigger: triggerReset,
  } = useForm({
    mode: "all",
    criteriaMode: "all",
  });

  const handleBlur = (formType, fieldName) => {
    if (formType === "password") {
      triggerPassword(fieldName);
    } else {
      triggerReset(fieldName);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");

    try {
      const response = await updatePassword({ 
        password: data.currentPassword, 
        newPassword: data.newPassword, 
        id: userid 
      });
      
      if (response?.data?.status === 401) {
        setServerError(response?.data?.message || "Có lỗi xảy ra");
      } else {
        toast.success("Cập nhật mật khẩu thành công");
        setToggleUpdatePassword(false);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật mật khẩu");
      console.error("Update password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data) => {
    setIsResetLoading(true);
    
    try {
      const response = await resetPassword(data.email);
      if(response?.data.error) {
        toast.error(response?.data.message || "Lỗi hệ thống");
      } else {
        toast.info(response?.data.message || "Đã gửi link đặt lại mật khẩu tới email của bạn");
        setShowForgotPassword(false);
        setToggleUpdatePassword(false);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu");
      console.error("Reset password error:", error);
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Thay đổi mật khẩu</h2>
        <IoMdCloseCircleOutline
          className="text-gray-400 cursor-pointer hover:text-gray-800 transition duration-200"
          size={24}
          onClick={() => setToggleUpdatePassword(false)}
        />
      </div>
      {!showForgotPassword ? (
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <PasswordInput 
            label="Mật khẩu hiện tại" 
            register={passwordRegister} 
            name="currentPassword"
            validation={{
              required: "Vui lòng nhập mật khẩu hiện tại",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự"
              }
            }}
            showPassword={showPassword} 
            setShowPassword={setShowPassword} 
            error={passwordErrors.currentPassword?.message || serverError} 
            placeholder="Nhập mật khẩu hiện tại"
            onBlur={() => handleBlur("password", "currentPassword")}
          />
          <PasswordInput 
            label="Mật khẩu mới" 
            register={passwordRegister} 
            name="newPassword"
            validation={{
              required: "Vui lòng nhập mật khẩu mới",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự"
              }
            }}
            showPassword={showNewPassword} 
            setShowPassword={setShowNewPassword} 
            error={passwordErrors.newPassword?.message} 
            placeholder="Nhập mật khẩu mới"
            onBlur={() => handleBlur("password", "newPassword")}
          />
          <PasswordInput 
            label="Xác nhận mật khẩu mới" 
            register={passwordRegister} 
            name="confirmPassword"
            validation={{
              required: "Vui lòng xác nhận mật khẩu mới",
              validate: value => value === watchPassword("newPassword") || "Mật khẩu xác nhận không trùng khớp"
            }}
            showPassword={showConfirmPassword} 
            setShowPassword={setShowConfirmPassword} 
            error={passwordErrors.confirmPassword?.message} 
            placeholder="Xác nhận mật khẩu mới"
            onBlur={() => handleBlur("password", "confirmPassword")}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" />
                Đang xử lý...
              </span>
            ) : (
              "Cập nhật"
            )}
          </button>
          <p className="text-center text-sm text-gray-500 mt-2 cursor-pointer" onClick={() => setShowForgotPassword(true)}>Quên mật khẩu?</p>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit(onResetSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nhập email</label>
            <input
              type="email"
              {...resetRegister("email", {
                required: "Vui lòng nhập email",
                validate: {
                  validFormat: value => validateEmail(value) || "Email không hợp lệ"
                }
              })}
              placeholder="Nhập email để nhận link đặt lại mật khẩu"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-100"
              onBlur={() => handleBlur("reset", "email")}
            />
            <small className="text-red-500 text-xs block h-5">
              {resetErrors.email?.message}
            </small>
          </div>
          <button 
            type="submit" 
            disabled={isResetLoading}
            className="w-full bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isResetLoading ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" />
                Đang gửi...
              </span>
            ) : (
              "Gửi link đặt lại mật khẩu"
            )}
          </button>
          <p className="text-center text-sm text-gray-500 mt-2 cursor-pointer" onClick={() => setShowForgotPassword(false)}>Quay lại</p>
        </form>
      )}
    </div>
  );
}