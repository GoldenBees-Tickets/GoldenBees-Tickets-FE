import { IoMdCloseCircleOutline } from "react-icons/io";
import { useState } from "react";
import { useUpdateUserMutation } from "@/api/userApi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { validateEmail } from "@/utils/auth";
import { FaSpinner } from "react-icons/fa";

export default function ChangeEmail({ setToggleUpdateEmail, userid }) {
  const [updateEmail] = useUpdateUserMutation();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({ 
    mode: "all", 
    criteriaMode: "all",
  });

  const handleBlur = (fieldName) => {
    trigger(fieldName);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const response = await updateEmail({ email: data.email, id: userid });    
      if (response.data.user.status === 200) {
        toast.success("Cập nhật email thành công");
        setToggleUpdateEmail(false);
      } else {
        toast.error(response?.data.error || "Lỗi hệ thống, vui lòng thử lại sau ít phút");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật email");
      console.error("Update email error:", error);
    } finally {
      setIsLoading(false);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="text-sm text-gray-600 mb-4">
          Vui lòng cung cấp email mới và mật khẩu của bạn, chúng tôi sẽ gửi mã
          xác thực cho bạn!
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email mới
          </label>
          <input
            {...register("email", {
              required: "Vui lòng điền email",
              validate: {
                validFormat: (value) => validateEmail(value) || "Sai định dạng email"
              }
            })}
            type="text"
            placeholder="Nhập email mới"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-100"
            onBlur={() => handleBlur("email")}
          />
          <small className="text-red-500 text-xs block h-5">
            {errors.email?.message}
          </small>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              Đang xử lý...
            </span>
          ) : (
            "Cập nhật"
          )}
        </button>
      </form>
    </div>
  );
}
