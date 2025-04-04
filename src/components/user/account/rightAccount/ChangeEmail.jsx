import { IoMdCloseCircleOutline } from "react-icons/io";
import { useState } from "react";
import { useUpdateUserMutation } from "@/api/userApi";
import { toast } from "react-toastify";

export default function ChangeEmail({ setToggleUpdateEmail,userid }) {
  const [updateEmail] = useUpdateUserMutation();

  const [email, setEmail] = useState("");

  const [errorEmail, setErrorEmail] = useState("");

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setErrorEmail("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === "") {
      setErrorEmail("Vui lòng điền email");
      return;
    } else if (!emailRegex.test(email)) {
      setErrorEmail("Sai định dạng email");
      return;
    }

    const response = await updateEmail({email, id: userid});    
    if(response.data.user.status === 200) {
      toast.success("Cập nhật email thành công");
      setToggleUpdateEmail(false);
    } else {
      toast.error(response?.data.error || "Lỗi hệ thống, vui lòng thử lại sau ít phút");
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
      <div className="flex relative justify-center items-center mb-4">
        <h2 className="text-lg font-semibold">Thay Đổi Email</h2>
        <IoMdCloseCircleOutline
          className="absolute right-0 text-gray-400 cursor-pointer hover:text-gray-800 transition duration-200"
          size={24}
          onClick={() => setToggleUpdateEmail(false)}
        />
      </div>
      <form onSubmit={handleUpdateEmail} action="">
        <p className="text-sm text-gray-600 mb-4">
          Vui lòng cung cấp email mới và mật khẩu của bạn, chúng tôi sẽ gửi mã
          xác thực cho bạn!
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email mới
          </label>
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email mới"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-100"
          />
          <small className="text-red-500">{errorEmail}</small>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600 transition duration-200"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}
