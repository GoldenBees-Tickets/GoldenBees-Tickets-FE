import { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../api/userApi";
import { formatImage } from "@/utils/formatImage";


export default function AccountDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const accessToken = localStorage.getItem("accessToken");
  const dataStorage = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );
  const id = dataStorage?.id;

  const { data: user, error, isLoading } = useGetUserQuery(id, {
    skip: !accessToken, // Bỏ qua query nếu không có token
  });

  const userData = useMemo(() => user?.user || user, [user]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);
  
  if (!accessToken || error?.status === 401) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 text-white bg-orange-400 rounded hover:bg-orange-500"
      >
        Login
      </button>
    );
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div
      className="relative inline-block cursor-pointer select-none"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <span className="btn-account flex items-center p-2 font-bold text-gray-600 bg-white">
        <span className="mx-1">{userData?.username}</span>
      </span>

      {isOpen && (
        <div className="absolute right-0 top-7 z-20 w-auto min-w-max py-2 mt-2 bg-white border rounded-md shadow-2xl">
          <Link
            to="/account"
            className="flex items-center p-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            <img
              className="w-9 h-9 rounded-full"
              src={formatImage(userData?.image)}
              alt="Avatar"
            />

            <div className="mx-1">
              <h1 className="text-sm font-semibold">{userData?.username}</h1>
              <p className="text-sm text-gray-500">{userData?.email}</p>
            </div>
          </Link>

          {userData?.role === "user" ? (
            <>
              <hr />
              <Link
                to="/account"
                className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
              >
                View Profile
              </Link>
              <Link
                to="/my-orders"
                className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
              >
                My Orders
              </Link>
            </>
          ) : (
            <Link
              to="/admin"
              className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
            >
              Admin Manager
            </Link>
          )}

          <hr />
          <span
            onClick={handleLogout}
            className="block px-4 py-3 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
          >
            Sign Out
          </span>
        </div>
      )}
    </div>
  );
}
