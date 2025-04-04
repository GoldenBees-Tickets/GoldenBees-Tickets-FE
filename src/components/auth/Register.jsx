import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegiterMutation } from "../../api/authApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import logoHeader from "../../public/LogoHeader.png";


export default function Register() {
  const [regiserUser] = useRegiterMutation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorUsername, setErrorUsername] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setErrorUsername("");
    setErrorEmail("");
    setErrorPassword("");
    setErrorConfirmPassword("");

    if (username.trim() === "") {
      setErrorUsername("Username is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === "") {
      setErrorEmail("Email is required");
      return;
    } else if (!emailRegex.test(email)) {
      setErrorEmail("Invalid email format");
      return;
    }
    if (password.trim() === "") {
      setErrorPassword("Password is required");
      return;
    }
    if (confirmPassword !== password) {
      setErrorConfirmPassword("The confirmation password does not match");
      return;
    }
    const user = await regiserUser({ username, email, password });
    if (user?.data.status === 401) {
      if (user?.data.field === "username") {
        setErrorUsername(user?.data.message);
        return;
      }
      if (user?.data.field === "email") {
        setErrorEmail(user?.data.message);
        return;
      }
    } else {
      toast.success("Đăng ký thành công.")
    }
  };

  return (
    <div className="bg-orange-50 font-[sans-serif] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Logo Section - Left */}
        <div className="md:w-2/5 bg-gradient-to-br from-orange-400 to-orange-600 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute w-full h-full top-0 left-0 bg-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="w-40 h-40 mx-auto animate-float">
              <img 
                src="/src/public/LogoHeader.png" 
                alt="logo" 
                className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform transition-transform duration-700 hover:rotate-12 animate-pulse"
              />
            </div>
            <h2 className="text-white text-2xl font-bold text-center mt-6 animate-typing overflow-hidden whitespace-nowrap">Bees-Cinema</h2>
            <p className="text-orange-100 text-center mt-2 animate-fadeIn opacity-0">Hệ thống đặt vé xem phim trực tuyến</p>
          </div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-300 rounded-full opacity-20"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-300 rounded-full opacity-20"></div>
        </div>
        
        {/* Form Section - Right */}
        <div className="md:w-3/5 p-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-orange-600 text-center text-2xl font-bold mb-6 animate-slideDown">
              Đăng ký tài khoản
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="animate-slideIn" style={{animationDelay: "0.2s"}}>
                <label className="text-gray-800 text-sm block mb-2">
                  Tên người dùng
                </label>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    required=""
                    className="w-full text-sm text-gray-800 border-b border-orange-200 focus:border-orange-500 px-2 py-3 outline-none transition-colors duration-300"
                    placeholder="Nhập tên người dùng"
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
                <small className="text-red-500">{errorUsername}</small>
              </div>
              <div className="animate-slideIn" style={{animationDelay: "0.4s"}}>
                <label className="text-gray-800 text-sm block mb-2">
                  Email
                </label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    required=""
                    className="w-full text-sm text-gray-800 border-b border-orange-200 focus:border-orange-500 px-2 py-3 outline-none transition-colors duration-300"
                    placeholder="Nhập email"
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
                <small className="text-red-500">{errorEmail}</small>
              </div>
              <div className="animate-slideIn" style={{animationDelay: "0.6s"}}>
                <label className="text-gray-800 text-sm block mb-2">
                  Mật khẩu
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    required=""
                    className="w-full text-sm text-gray-800 border-b border-orange-200 focus:border-orange-500 px-2 py-3 outline-none transition-colors duration-300"
                    placeholder="Nhập mật khẩu"
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
                <small className="text-red-500">{errorPassword}</small>
              </div>
              <div className="animate-slideIn" style={{animationDelay: "0.8s"}}>
                <label className="text-gray-800 text-sm block mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative flex items-center">
                  <input
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required=""
                    className="w-full text-sm text-gray-800 border-b border-orange-200 focus:border-orange-500 px-2 py-3 outline-none transition-colors duration-300"
                    placeholder="Xác nhận mật khẩu"
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
                <small className="text-red-500">{errorConfirmPassword}</small>
              </div>
              <div className="mt-8 animate-slideIn" style={{animationDelay: "1s"}}>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none transform transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                >
                  Đăng ký
                </button>
              </div>
              <p className="text-gray-800 text-sm mt-6 text-center animate-slideIn" style={{animationDelay: "1.2s"}}>
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
const style = document.createElement('style');
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
  
  .bg-pattern {
    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;
document.head.appendChild(style);
