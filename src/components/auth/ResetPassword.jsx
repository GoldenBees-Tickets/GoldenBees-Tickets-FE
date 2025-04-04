import { useState } from "react";
import { Link } from "react-router-dom";
import { useResetPassMutation } from "../../api/authApi";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [resetPass] = useResetPassMutation();
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorEmail("");
    if (email.trim() === "") {
      setErrorEmail("Email is require!");
    }

    setIsLoading(true);
    try {
      const response = await resetPass(email);

      if (response.data.status === 401) {
        setErrorEmail("Không tìm thấy tài khoản nào!");
      } else {
        toast.success("Vui lòng kiểm tra email của bạn để lấy mật khẩu mới.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-orange-50 font-[sans-serif] min-h-screen flex items-center justify-center p-4">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="w-16 h-16 border-4 border-t-orange-600 border-gray-300 rounded-full animate-spin"></div>
        </div>
      )}
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
              Quên mật khẩu
            </h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="animate-slideIn" style={{animationDelay: "0.2s"}}>
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
                    placeholder="Nhập email của bạn"
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
              <div className="!mt-8 animate-slideIn" style={{animationDelay: "0.4s"}}>
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none transform transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] animate-button-appear"
                >
                  Lấy lại mật khẩu
                </button>
              </div>
              <p className="text-gray-800 text-sm mt-6 text-center animate-slideIn" style={{animationDelay: "0.6s"}}>
                Đã có tài khoản?
                <Link
                  to="/login"
                  className="text-orange-500 hover:text-orange-700 font-semibold transition-colors duration-300 ml-1 whitespace-nowrap"
                >
                  Đăng nhập
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
  
  @keyframes buttonAppear {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-button-appear {
    animation: buttonAppear 0.5s ease-out 0.5s forwards;
    opacity: 0;
  }
  
  .bg-pattern {
    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;
document.head.appendChild(style);
