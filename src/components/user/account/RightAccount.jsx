import { useState } from "react";
import Infor from "./rightAccount/Infor";
import TransactionHistory from "./rightAccount/TransactionHistory";

export default function RightAccount({ user }) {
  const [activeTab, setActiveTab] = useState("infor");

  return (
    <>
      <div className="w-full bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <div className="border-b pb-3 sm:pb-4 mb-3 sm:mb-4 flex overflow-x-auto sm:flex-wrap gap-2 sm:gap-4 text-gray-700 no-scrollbar">
          <button
            onClick={() => setActiveTab("infor")}
            className={`text-sm sm:text-base whitespace-nowrap py-1 ${
              activeTab === "infor"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500 font-medium"
            }`}
          >
            Thông Tin Cá Nhân
          </button>
          <button
            onClick={() => setActiveTab("transaction")}
            className={`text-sm sm:text-base whitespace-nowrap py-1 ${
              activeTab === "transaction"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500 font-medium"
            }`}
          >
            Lịch Sử Giao Dịch
          </button>
          <button
            onClick={() => setActiveTab("notification")}
            className={`text-sm sm:text-base whitespace-nowrap py-1 ${
              activeTab === "notification"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500 font-medium"
            }`}
          >
            Thông Báo
          </button>
          <button
            onClick={() => setActiveTab("gift")}
            className={`text-sm sm:text-base whitespace-nowrap py-1 ${
              activeTab === "gift"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500 font-medium"
            }`}
          >
            Quà Tặng
          </button>
          <button
            onClick={() => setActiveTab("policy")}
            className={`text-sm sm:text-base whitespace-nowrap py-1 ${
              activeTab === "policy"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500 font-medium"
            }`}
          >
            Chính Sách
          </button>
        </div>

        {/* Render nội dung tương ứng */}
        <div className="mt-2 sm:mt-4">
          {activeTab === "infor" && <Infor user={user} />}
          {activeTab === "transaction" && <TransactionHistory user={user} />}
          {activeTab === "notification" && <div>Thông báo</div>}
          {activeTab === "gift" && <div>Quà tặng</div>}
          {activeTab === "policy" && <div>Chính sách</div>}
        </div>
      </div>
    </>
  );
}
