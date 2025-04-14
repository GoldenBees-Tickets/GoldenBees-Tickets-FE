import { IoGiftSharp } from "react-icons/io5";
import { BiSolidMedal } from "react-icons/bi";
import { useUpdateUserMutation } from "@/api/userApi";
import { toast } from "react-toastify";
import { formatImage } from "@/utils/formatImage";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function LeftAccount({ user }) {  
  
  const [changeImage] = useUpdateUserMutation();
  const [isUploading, setIsUploading] = useState(false);
  
  const spendingMilestones = [
    { label: "0 đ", value: 0 },
    { label: "2,000,000 đ", value: 2000000 },
    { label: "4,000,000 đ", value: 4000000 },
  ];

  const handleUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    
    setIsUploading(true);
    try {
      const response = await changeImage({ id: user.id, image });  
      console.log("Response:", response);
        
      if(response?.data.error) {
        return toast.error(response?.data.error || "Lỗi khi cập nhật ảnh");
      }

      if (response?.data.success && response?.data.status === 200) {
        toast.success(response?.data.message || "Cập nhật ảnh thành công");
      } else {
        toast.error(response?.data.error || "Lỗi khi cập nhật ảnh");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Đã xảy ra lỗi khi tải ảnh lên");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const currentSpending = 0;
  const maxSpending = spendingMilestones[spendingMilestones.length - 1].value;

  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="text-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-300 shadow-sm relative">
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <FaSpinner className="animate-spin text-white text-xl" />
            </div>
          )}
          {user?.image ? (
            <img
              className="w-full h-full object-cover"
              src={formatImage(user?.image)}
              alt="User avatar"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              Ảnh
            </div>
          )}
        </div>

        <div className="relative mt-4 sm:mt-5 w-fit mx-auto">
          <label
            htmlFor="upload"
            className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-lg before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-lg before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isUploading ? (
              <>
                <FaSpinner className="animate-spin w-4 h-4 sm:w-5 sm:h-5 relative" />
                <span className="font-medium text-xs sm:text-sm relative">Đang tải...</span>
              </>
            ) : (
              <>
                <img
                  className="w-4 h-4 sm:w-5 sm:h-5 relative"
                  src="https://www.svgrepo.com/show/485545/upload-cicle.svg"
                  alt="Upload icon"
                />
                <span className="font-medium text-xs sm:text-sm relative group-hover:text-blue-900">
                  Tải ảnh lên
                </span>
              </>
            )}
          </label>
          <input 
            hidden 
            type="file" 
            id="upload" 
            onChange={handleUpload} 
            disabled={isUploading}
            accept="image/*"
          />
        </div>

        <h2 className="flex items-center justify-center mt-4 text-lg sm:text-xl font-semibold text-gray-900">
          <BiSolidMedal className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
          <span className="ml-2">{user?.username || "User"}</span>
        </h2>
        <div className="flex items-center justify-center mt-1.5 text-gray-800 text-sm">
          <IoGiftSharp className="text-orange-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="ml-1.5">{user?.star} stars</span>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <h3 className="text-gray-800 text-sm sm:text-base font-medium mb-2">Tổng chi tiêu 2025</h3>
        <div className="relative w-full h-3 sm:h-4 bg-gray-200 rounded-md overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-md"
            style={{ width: `${(currentSpending / maxSpending) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-500">
          {spendingMilestones.map((milestone) => (
            <span key={milestone.value}>{milestone.label}</span>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 border-t pt-4 text-center">
        <p className="text-xs sm:text-sm text-gray-600">
          HOTLINE hỗ trợ: <span className="font-medium">19002224</span> (9:00 -
          22:00)
        </p>
      </div>
    </div>
  );
}
