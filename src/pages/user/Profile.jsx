import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useGetUserQuery } from "../../api/userApi";
import LeftAccount from "../../components/user/account/LeftAccount";
import RightAccount from "../../components/user/account/RightAccount";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

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

  const { data: userData, error } = useGetUserQuery(userid, {
    skip: !userid,
  });

  if(!userData) {    
    message.info("Please login to continue");
    localStorage.clear();
    return navigate("/login");
  }
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
  
  return (
    <div className="flex bg-gray-100 min-h-screen p-6">
      <LeftAccount user={user} />
      <RightAccount user={user} />
    </div>
  );
}
