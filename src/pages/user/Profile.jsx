import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useGetUserQuery } from "../../api/userApi";
import LeftAccount from "../../components/user/account/LeftAccount";
import RightAccount from "../../components/user/account/RightAccount";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { FaSpinner } from "react-icons/fa";

export default function UserProfile() {
  const navigate = useNavigate();
  const [userid, setUserId] = useState(null);  
  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Token không hợp lệ", error);
      }
    }
  }, []);

  const { data: userData, error, isLoading } = useGetUserQuery(userid, {
    skip: !userid,
  });

  useEffect(() => {
    if (userid && !isLoading && !userData && !error) {
      message.info("Please login to continue");
      localStorage.clear();
      navigate("/login");
    }
  }, [userid, userData, navigate, isLoading, error]);
  
  const user = useMemo(() => {
    if (userData && userData.user) {
      return {
        ...userData.user,
      };
    }
    return null;
  }, [userData]);
  
  if (error) {
    console.error("Error fetching user:", error);
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Tài khoản của tôi
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <LeftAccount user={user} />
          </div>
          
          {/* Right side */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <RightAccount user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
