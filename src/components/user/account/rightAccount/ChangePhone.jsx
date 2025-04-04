import { IoMdCloseCircleOutline } from "react-icons/io";
import { useState } from "react";
import { useUpdateUserMutation } from "@/api/userApi";
import { toast } from "react-toastify";
export default function ChangePhone({ setToggleUpdatePhone, userid }) {
  const [updatePhone] = useUpdateUserMutation();

  const [phone, setPhone] = useState("");

  const [errorPhone, setErrorPhone] = useState("");

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    setErrorPhone("");
    const phonePattern = /^(?:\+84|0)\d{9,10}$/;
    if (!phonePattern.test(phone)) {
      setErrorPhone("Số điện thoại không hợp lệ");
      return;
    }

    const response = await updatePhone({ phone, id: userid });
    if (response.data.user.status === 200) {
      toast.success("Cập nhật sdt thành công");
      setToggleUpdatePhone(false);
    } else {
      toast.error(response?.data.error || "Lỗi hệ thống, vui lí thử lại sau ít phút");
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
      <div className="flex relative justify-center items-center mb-4">
        <h2 className="text-lg font-semibold">Thay đổi số điện thoại</h2>
        <IoMdCloseCircleOutline
          className="absolute right-0 text-gray-400 cursor-pointer hover:text-gray-800 transition duration-200"
          size={24}
          onClick={() => setToggleUpdatePhone(false)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số điện thoại mới
        </label>
        <input
          type="number"
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Nhập số điện thoại mới"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-100"
        />
        <small className="text-red-500">{errorPhone}</small>
      </div>
      <button
        className="w-full bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600 transition duration-200"
        onClick={handleUpdatePhone}
      >
        Cập nhật
      </button>
    </div>
  );
}
