import { useState } from "react";
import Infor from "./rightAccount/Infor";
import TransactionHistory from "./rightAccount/TransactionHistory";

export default function RightAccount({ user }) {
  const [activeTab, setActiveTab] = useState("infor");

  return (
    <>
      <div className="w-full md:w-2/3 mt-6 md:mt-0 md:ml-6 bg-white shadow-lg rounded-lg p-6">
        <div className="border-b pb-4 mb-4 flex space-x-4 text-gray-700">
          <button
            onClick={() => setActiveTab("infor")}
            className={`${
              activeTab === "infor"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500 font-medium"
            }`}
          >
            Thông Tin Cá Nhân
          </button>
          <button
            onClick={() => setActiveTab("transaction")}
            className={`${
              activeTab === "transaction"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500 font-medium"
            }`}
          >
            Lịch Sử Giao Dịch
          </button>
          <button
            onClick={() => setActiveTab("notification")}
            className={`${
              activeTab === "notification"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500 font-medium"
            }`}
          >
            Thông Báo
          </button>
          <button
            onClick={() => setActiveTab("gift")}
            className={`${
              activeTab === "gift"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500 font-medium"
            }`}
          >
            Quà Tặng
          </button>
          <button
            onClick={() => setActiveTab("policy")}
            className={`${
              activeTab === "policy"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500 font-medium"
            }`}
          >
            Chính Sách
          </button>
        </div>

        {/* Render nội dung tương ứng */}
        {activeTab === "infor" && <Infor user={user} />}
        {activeTab === "transaction" && <TransactionHistory user={user} />}
        {activeTab === "notification" && <div>Thông báo</div>}
        {activeTab === "gift" && <div>Quà tặng</div>}
        {activeTab === "policy" && <div>Chính sách</div>}
      </div>
    </>
  );
}
