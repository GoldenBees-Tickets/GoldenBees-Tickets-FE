import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegiterMutation } from "../../api/authApi";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { validateEmail } from "../../utils/auth";

export default function Register() {
  const [regiserUser] = useRegiterMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
    trigger,
  } = useForm({
    mode: "all",
    criteriaMode: "all",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState({ field: "", message: "" });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError({ field: "", message: "" });

    try {
      const response = await regiserUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      if (response?.data.error && response?.data.status === 401) {
        toast.error(response?.data?.message || "Lỗi hệ thống");
      } else {
        toast.success(
          response?.data.message ||
            "Đăng ký thành công. Kiểm tra email để kích hoạt tài khoản"
        );
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (fieldName) => {
    trigger(fieldName);
  };

  return (
    <div className="bg-orange-50 font-[sans-serif] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Logo Section - Left */}
        <div className="md:w-2/5 bg-gradient-to-br from-orange-400 to-orange-600 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute w-full h-full top-0 left-0 bg-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="w-40 h-40 mx-auto animate-float">
              <Link to="/">
                <img
                  src="/src/public/LogoHeader.png"
                  alt="logo"
                  className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform transition-transform duration-700 hover:rotate-12 animate-pulse"
                />
              </Link>
            </div>
            <h2 className="text-white text-2xl font-bold text-center mt-6 animate-typing overflow-hidden whitespace-nowrap">
              Bees-Cinema
            </h2>
            <p className="text-orange-100 text-center mt-2 animate-fadeIn opacity-0">
              Hệ thống đặt vé xem phim trực tuyến
            </p>
          </div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-300 rounded-full opacity-20"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-300 rounded-full opacity-20"></div>
        </div>

        {/* Form Section - Right */}
        <div className="md:w-3/5 p-8 overflow-y-auto max-h-screen">
          <div className="max-w-md mx-auto">
            <h2 className="text-orange-600 text-center text-2xl font-bold mb-6 animate-slideDown">
              Đăng ký tài khoản
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div
                className="animate-slideIn"
                style={{ animationDelay: "0.2s" }}
              >
                <label className="text-gray-800 text-sm block mb-1">
                  Tên người dùng
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                    type="text"
                    className="w-full text-sm text-gray-800 border-b border-orange-200 focus:border-orange-500 px-2 py-2 outline-none transition-colors duration-300"
                    placeholder="Nhập tên người dùng"
                    onBlur={() => handleBlur("username")}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#F97316"
                    className="w-[18px] h-[18px] absolute right-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 1.791-8 4v2h16v-2c0-2.209-3.582-4-8-4z" />
                  </svg>
                </div>
                <small className="text-red-500 text-xs block h-5">
                  {errors.username?.message ||
                    (serverError.field === "username" && serverError.message)}
                </small>
              </div>
              <div
                className="animate-slideIn"
                style={{ animationDelay: "0.4s" }}
              >
                <label className="text-gray-800 text-sm block mb-1">
                  Email
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("email", {
                      required: "Email is required",
                      validate: {
                        validFormat: (value) =>
                          validateEmail(value) || "Invalid email format",
                      },
                    })}
                    type="text"
                    className="w-full text-sm text-gray-800 border-b border-orange-200 focus:border-orange-500 px-2 py-2 outline-none transition-colors duration-300"
                    placeholder="Nhập email"
                    onBlur={() => handleBlur("email")}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#F97316"
                    stroke="#F97316"
                    className="w-[18px] h-[18px] absolute right-2"
                    viewBox="0 0 682.667 682.667"
                  >
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path d="M0 512h512V0H0Z" data-original="#000000" />
                      </clipPath>
                    </defs>
                    <g
                      clipPath="url(#a)"
                      transform="matrix(1.33 0 0 -1.33 0 682.667)"
                    >
                      <path
                        fill="none"
                        strokeMiterlimit={10}
                        strokeWidth={40}
                        d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                        data-original="#000000"
                      />
                      <path
                        d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                        data-original="#000000"
                      />
                    </g>
                  </svg>
                </div>
                <small className="text-red-500 text-xs block h-5">
                  {errors.email?.message ||
                    (serverError.field === "email" && serverError.message)}
                </small>
              </div>
              <div
                className="animate-slideIn"
                style={{ animationDelay: "0.6s" }}
              >
                <label className="text-gray-800 text-sm block mb-1">
                  Mật khẩu
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className="w-full text-sm text-gray-800 border-b border-orange-200 focus:border-orange-500 px-2 py-2 outline-none transition-colors duration-300"
                    placeholder="Nhập mật khẩu"
                    onBlur={() => handleBlur("password")}
                  />
                  {showPassword ? (
                    <FaEye
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="w-[16px] text-orange-400 absolute right-2 cursor-pointer"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="w-[16px] text-orange-400 absolute right-2 cursor-pointer"
                    />
                  )}
                </div>
                <small className="text-red-500 text-xs block h-5">
                  {errors.password?.message}
                </small>
              </div>
              <div
                className="animate-slideIn"
                style={{ animationDelay: "0.8s" }}
              >
                <label className="text-gray-800 text-sm block mb-1">
                  Xác nhận mật khẩu
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") ||
                        "The confirmation password does not match",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full text-sm text-gray-800 border-b border-orange-200 focus:border-orange-500 px-2 py-2 outline-none transition-colors duration-300"
                    placeholder="Xác nhận mật khẩu"
                    onBlur={() => handleBlur("confirmPassword")}
                  />
                  {showConfirmPassword ? (
                    <FaEye
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="w-[16px] text-orange-400 absolute right-2 cursor-pointer"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="w-[16px] text-orange-400 absolute right-2 cursor-pointer"
                    />
                  )}
                </div>
                <small className="text-red-500 text-xs block h-5">
                  {errors.confirmPassword?.message}
                </small>
              </div>
              <div
                className="mt-6 animate-slideIn"
                style={{ animationDelay: "1s" }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none transform transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    "Đăng ký"
                  )}
                </button>
              </div>
              <p
                className="text-gray-800 text-sm mt-4 text-center animate-slideIn"
                style={{ animationDelay: "1.2s" }}
              >
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-orange-500 hover:text-orange-700 font-semibold transition-colors duration-300 ml-1 whitespace-nowrap"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Thêm style keyframes để tạo hiệu ứng */
const style = document.createElement("style");
style.textContent = `
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  
  .animate-typing {
    animation: typing 1.5s steps(20, end) forwards;
    width: 0;
    border-right: 2px solid orange;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 1s ease-out 1.5s forwards;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slideDown {
    animation: slideDown 0.8s ease-out forwards;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slideIn {
    animation: slideIn 0.8s ease-out forwards;
  }
  
  .bg-pattern {
    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;
document.head.appendChild(style);
